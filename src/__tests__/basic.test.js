import React from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useForm } from '../index';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

it('can render a form', async () => {
  const { register, state, handleSubmit } = renderHook(() => useForm()).result.current;

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
  // fireEvent.click(submitButton);

  function onSubmit(values) {
    console.log('onSubmit', { values });
  }

  // wait a tick for dawei value to resolve
  await state.resolve();

  expect(state.get('values')).toEqual({ name: 'state dawei', age: 10, check: true });
});

it('can accept default values on component', async () => {
  const { register, state, handleSubmit } = renderHook(() => useForm()).result.current;

  const utils = render(
    <form onSubmit={handleSubmit(onSubmit)}>
      <input data-testid="name" defaultValue="state dawei" name="name" {...register('name')} />
      <input data-testid="age" name="age" defaultValue={10} type="number" {...register('age')} />
      <input data-testid="check" defaultValue={true} type="checkbox" {...register('check')} />
      <button type="submit" data-testid="submit" />
    </form>
  );

  function onSubmit(values) {
    console.log('onSubmit', { values });
  }

  // wait a tick for dawei value to resolve
  await state.resolve();

  expect(state.get()).toEqual({
    defaultValues: { name: 'state dawei', age: 10, check: true },
    values: { name: 'state dawei', age: 10, check: true },
  });
});

it('can accept default values on register', async () => {
  const { register, state, handleSubmit } = renderHook(() => useForm()).result.current;

  const utils = render(
    <form onSubmit={handleSubmit(onSubmit)}>
      <input data-testid="name" name="name" {...register('name', { default: 'state dawei' })} />
      <input data-testid="age" name="age" type="number" {...register('age', { default: 10 })} />
      <input data-testid="check" type="checkbox" {...register('check', { default: true })} />
      <button type="submit" data-testid="submit" />
    </form>
  );

  function onSubmit(values) {
    console.log('onSubmit', { values });
  }

  // wait a tick for dawei value to resolve
  await state.resolve();

  expect(state.get()).toEqual({
    defaultValues: { name: 'state dawei', age: 10, check: true },
    values: { name: 'state dawei', age: 10, check: true },
  });
});

it('will mark fields as touched', async () => {
  const { register, state, handleSubmit, isDirty, touched, commit } = renderHook(() =>
    useForm()
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
  // fireEvent.click(submitButton);

  function onSubmit(values) {
    console.log('onSubmit', { values });
  }

  // wait a tick for dawei value to resolve
  await state.resolve();

  // expect(store.get('values')).toEqual({ name: 'state dawei', age: 10, check: true });
  expect(touched()).toEqual({ name: true, age: true, check: true });
  expect(isDirty()).toEqual(true);
});

it('will let you commit a form, clearing dirty and touched', async () => {
  const { register, state: store, handleSubmit, isDirty, touched, commit } = renderHook(() =>
    useForm()
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
  // fireEvent.click(submitButton);

  function onSubmit(values) {
    console.log('onSubmit', { values });
  }

  // wait a tick for dawei value to resolve
  await store.resolve();

  // expect(store.get('values')).toEqual({ name: 'state dawei', age: 10, check: true });
  expect(touched()).toEqual({ name: true, age: true, check: true });
  expect(isDirty()).toEqual(true);
  commit();
  await store.resolve();
  expect(touched()).toEqual({});
  expect(isDirty()).toEqual(false);
});


it('can handle disabled fields', async () => {
  const { register, state, handleSubmit } = renderHook(() => useForm()).result.current;

  const utils = render(
    <form onSubmit={handleSubmit(onSubmit)}>
      <input data-testid="name" disabled name="name" {...register('name', { default: 'initial'})} />
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
  // fireEvent.click(submitButton);

  function onSubmit(values) {
    console.log('onSubmit', { values });
  }

  // wait a tick for dawei value to resolve
  await state.resolve();

  expect(state.get('values')).toEqual({ name: 'initial', age: 10, check: true });
});