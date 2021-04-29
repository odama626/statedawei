import { useMemo, useRef } from 'react';
import { createStore } from 'dawei';

function convertType(type: string, value: string) {
  switch (type) {
    case 'number':
      return parseFloat(value);
    case 'checkbox':
      return value === 'true';
    default:
      return value;
  }
}

type setErrorType = (path: string, error: any) => void;

export interface RegisterOptions {
  default?: any;
  validate: (values: any, setError: setErrorType) => void;
}

const defaultValidate: RegisterOptions['validate'] = (values, setError) => {};

const devlog = (...args: string[]) => console.log('[statedawei]', ...args);
const eventlog = (e: string, ...args: string[]) => devlog(`${e}:`, ...args);

export function useForm<FormState>({ validate = defaultValidate } = {}) {
  const formState = useRef(
    useMemo(() => createStore({ state: { isDirty: false, touched: [] } }), [])
  );
  const regState = useRef<any>({ registered: {}, mounted: {} });
  formState.current.use('isDirty');

  function register(name: string, options: Partial<RegisterOptions> = {}) {
    const state = formState.current;
    const { registered, mounted } = regState.current;
    if (!registered[name]) {
      if ('default' in options) {
        state.set(options.default, `defaultValues.${name}`);
        state.set(options.default, `values.${name}`);
      }
      eventlog('registered', name);
    }

    registered[name] = true;

    return {
      key: name,
      ref: (ref: any) => {
        if (!ref) return;

        let value = convertType(ref.type, ref.value || ref.defaultValue);
        if (!mounted[name]) {
          eventlog('mounted', name);
          state.set(value, `defaultValues.${name}`);
          mounted[name] = true;
        } else {
          eventlog('reattached', name);
        }
        state.set(value, `values.${name}`);
      },
      onChange: (e: any) => {
        if (e.target.disabled) return;
        let value = convertType(e.target.type, e.target.value);
        state.set(true, `state.touched.${name}`);
        state.set(true, 'state.isDirty');
        return state.set(value, `values.${name}`);
      },
      onBlur: (e: any) => {},
    };
  }

  const handleSubmit = (onSubmit: (values: FormState) => any) => (e: any) => {
    e.preventDefault();
    const state = formState.current;
    state.resolve().then(async () => {
      let values: FormState = state.get('values');
      let hasErrors = false;
      await state.set(null, 'state.errors', { overwrite: true });
      const setError = (path: string, value: any) => {
        hasErrors = true;
        console.log(path, value)
        return state.set(value, `state.errors.${path}`);
      };
      await Promise.resolve(validate(values, setError));
      if (!hasErrors) return onSubmit(values);
    });
  };

  function commit() {
    const state = formState.current;
    let values = state.get('values');
    return state.set({ state: { touched: {}, isDirty: false, errors: {} }, defaultValues: values });
  }

  return {
    register,
    state: formState.current,
    useFormState: () => formState.current.use('state')[0],
    handleSubmit,
    commit,
  };
}
