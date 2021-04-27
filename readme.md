# StateDawei

## Getting Started

install libraries
```sh
npm i dawei statedawei
```

## Examples

Basic setup for a form
```js
import { useForm } from 'statedawei';

function App() {
  const { register, handleSubmit, commit, isDirty, touched } = useForm();

  function onSubmit(values) {
    console.log(values);

    commit(); // reset touched and defaults to current value
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="name" {...register('name')} />
      <input name="age" type="number" {...register('age')} />
      <input type="checkbox" {...register('check', { default: true })} />
      <button type="submit" disabled={!isDirty} />
    </form>
  );
}
```

## Validation
basic form with some validation
```js
import { useForm } from 'statedawei';

function validate(values, setError) {
  const { name, age } = values;
  if (age < 21) setError('age', 'Must be at least 21');
  if (!name.length) setError('name', 'required');
}

function App() {
  const { register, handleSubmit, commit, isDirty, touched } = useForm({ validate });

  function onSubmit(values) {
    console.log(values);

    commit(); // reset touched values, errors and sets defaults to current values
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input name="name" {...register('name')} />
      <input name="age" type="number" {...register('age')} />
      <input type="checkbox" {...register('check', { default: true })} />
      <button type="submit" disabled={!isDirty} />
    </form>
  );
}
```

## API

### result = useForm(options:)

#### options:
  - validate(values, setError) => void;
    - values - the current form values
    - setError(path, error)
      - path - the path to the name ex 'name'
      - error - the validation message to be shown

#### useForm result
  - register(name, options)
    - register an input, returns { onChange, onBlur }
    - arguments
      - name - name for input
      - options
        - default: default value for input
  - handleSubmit(onSubmit)
    - pass into form onSubmit
    - arguments
      - onSubmit(values)
        - called when submitted after validation
        - values - all values in form
  - commit()
      - after submitting a form you can call this to commit the changes
      - resets touched values
      - resets errors
      - sets isDirty to false
      - sets defaultValues to current values
  - touched()
    - shows which inputs have been touched
      - returns key value pairs
        - `[input name]: boolean`
  - isDirty()
    - returns a boolean indicating whether the form is dirty or not
  - errors()
    - shows all errors that currently exist in the form
      - returns key value pairs
        - `[input name]: <error message>`