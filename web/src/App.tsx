import { useData } from './data';

export function App() {
  const data = useData();

  return (
    <>
      Hello
      <br />
      This is the data:
      <code>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </code>
    </>
  );
}
