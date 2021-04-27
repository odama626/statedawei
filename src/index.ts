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

export function useForm({ validate = defaultValidate } = {}) {
  const formState = useRef(useMemo(() => createStore(), []));

  function register(name: string, options: Partial<RegisterOptions> = {}) {
    const state = formState.current;
    if ('default' in options) {
      state.set(options.default, `defaultValues.${name}`);
      state.set(options.default, `values.${name}`);
    }
    return {
      ref: (ref: any) => {
        if (!ref) return;

        if ('default' in options) return;
        let value = convertType(ref.type, ref.defaultValue);
        state.set(value, `defaultValues.${name}`);
        state.set(value, `values.${name}`);
      },
      onChange: (e: any) => {
        if (e.target.disabled) return;
        let value = convertType(e.target.type, e.target.value);
        state.set(true, `touched.${name}`);
        state.set({ isDirty: true });
        return state.set(value, `values.${name}`);
      },
      onBlur: (e: any) => {},
    };
  }

  const handleSubmit = (onSubmit: Function) => (e: any) => {
    e.preventDefault();
    const state = formState.current;
    state.resolve().then(async () => {
      let values = state.get('values');
      let hasErrors = false;
      const setError = (path: string, value: any) => {
        hasErrors = true;
        return state.set(value, `errors.${path}`);
      };
      await Promise.resolve(validate(values, setError));
      if (!hasErrors) return onSubmit(values);
    });
  };

  function commit() {
    const state = formState.current;
    let values = state.get('values');
    return state.set({ touched: {}, isDirty: false, defaultValues: values, errors: {} });
  }

  return {
    register,
    state: formState.current,
    isDirty: () => formState.current.get('isDirty'),
    touched: () => formState.current.get('touched'),
    handleSubmit,
    errors: () => formState.current.get('errors'),
    commit,
  };
}
