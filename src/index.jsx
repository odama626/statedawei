import { createStore } from 'dawei';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from './main';


const store = createStore();

function Note({ data }) {
  const { title, content } = data;

  return (
    <figure>
      <h1>{title}</h1>
      <p>{content}</p>
    </figure>
  );
}

function formValidation(values, setError) {
  const { title, content } = values;
  console.log({ values })
  if (!title.length) setError('title', 'Title is required');
  if (!content.length) {
    setError('content', 'Content is required');
  } else if (content.includes('e')) {
    setError('content', 'Content is not allowed to contain the letter e');
  }
}

function ValidationMsg({ error}) {
  return error ? <p style={{ color: 'red'}}>{error}</p> : null;
}

export default function App() {
  const { register, state, handleSubmit, commit, useFormState } = useForm({ validate: formValidation });
  const [notes = [], setNotes] = store.use('notes');
  const { isDirty, errors } = useFormState();

  function createNote(values) {
    setNotes([...notes, { id: notes.length, ...values }]);
    console.log(state.get());
    // commit();
  }

  console.log({ errors });

  console.log(isDirty);

  return (
    <div className="App">
      <div className="content">
        <form onSubmit={handleSubmit(createNote)}>
          <h1>Create Note</h1>
          <label>
            <p>Title:</p>
            <input {...register('title')} />
            <ValidationMsg error={errors?.title} />
          </label>
          <label>
            <p>Content:</p>
            <textarea {...register('content')} />
            <ValidationMsg error={errors?.content} />
          </label>
          <br />
          <button type="submit" disabled={!isDirty}>
            Create
          </button>
        </form>
        {!notes.length && (
          <>
            <h2>You don't have any notes!</h2>
            <p>Create some notes to get started</p>
          </>
        )}
        {notes.map(note => (
          <Note key={note.id} data={note} />
        ))}
      </div>
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);
