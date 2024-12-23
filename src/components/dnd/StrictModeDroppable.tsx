import { useEffect, useState } from 'react';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

/**
 * Wrapper para o Droppable que é compatível com o React.StrictMode
 * Resolve o problema de hydration no React 18
 */
export function StrictModeDroppable(props: DroppableProps) {
  const [enabled, setEnabled] = useState(false);
  const { children, ...droppableProps } = props;

  useEffect(() => {
    // Pequeno hack para evitar o erro de hydration no React 18
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <Droppable {...droppableProps}>
      {(provided, snapshot) => children(provided, snapshot)}
    </Droppable>
  );
}
