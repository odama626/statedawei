import { fireEvent, render } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useForm } from '../index';

function basicValidation(values, setError) {
  const { age } = values;
  if (age < 18 || age > 40) setError('age', 'Must be between 18 and 40');
}

it('can validate basic fields', async () => {
  const { register, state, handleSubmit } = renderHook(() =>
    useForm({ validate: basicValidation })
  ).result.current;

  const utils = render(
    <form onSubmit={handleSubmit(onSubmit)}>
      <input data-testid="name" name="name" {...register('name')} />
      <input data-testid="age" name="age" type="number" {...register('age')} />
      <input data-testid="check" type="checkbox" {...register('check')} />
      <button type="submit" data-testid="submit" />
    </form>
  );
  const nameInput = utils.getByTestId('name');
  const ageInput = utils.getByTestId('age');
  const checkboxInput = utils.getByTestId('check');
  const submitButton = utils.getByTestId('submit');

  fireEvent.change(nameInput, { target: { value: 'state dawei' } });
  fireEvent.change(ageInput, { target: { value: 10 } });
  fireEvent.click(checkboxInput, { target: { value: true } });
  fireEvent.click(submitButton);

  let called = false;

  function onSubmit(values) {
    called = true;
  }

  await state.resolve(); // wait a tick for dawei value to resolve
  await state.resolve(); // wait a second tick for validation

  expect(state.get('errors')).toEqual({ age: 'Must be between 18 and 40' });
  expect(called).toEqual(false);
});

it('will clear errors with commit', async () => {
  const { register, state, handleSubmit, commit } = renderHook(() =>
    useForm({ validate: basicValidation })
  ).result.current;

  const utils = render(
    <form onSubmit={handleSubmit(onSubmit)}>
      <input data-testid="name" name="name" {...register('name')} />
      <input data-testid="age" name="age" type="number" {...register('age')} />
      <input data-testid="check" type="checkbox" {...register('check')} />
      <button type="submit" data-testid="submit" />
    </form>
  );
  const nameInput = utils.getByTestId('name');
  const ageInput = utils.getByTestId('age');
  const checkboxInput = utils.getByTestId('check');
  const submitButton = utils.getByTestId('submit');

  fireEvent.change(nameInput, { target: { value: 'state dawei' } });
  fireEvent.change(ageInput, { target: { value: 10 } });
  fireEvent.click(checkboxInput, { target: { value: true } });
  fireEvent.click(submitButton);

  function onSubmit(values) {}

  await state.resolve(); // wait a tick for dawei value to resolve
  await state.resolve(); // wait a second tick for validation

  commit();

  await state.resolve();

  expect(state.get('errors')).toEqual({});
});
