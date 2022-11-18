import { Stack, Text, Box, Group } from '@mantine/core';
import { FC, ReactNode, ReactElement } from 'react';
import {
  DragDropContext,
  Droppable,
  resetServerContext,
  DragDropContextProps,
  Direction,
} from 'react-beautiful-dnd';

type CommonProps = {
  // onAddField: () => void;
  children: ReactNode | ReactElement;
  title?: string;
};
type DraggableFormItemsProps = CommonProps &
  (
    | {
        draggable: false;
      }
    | {
        draggable: true;
        DragDropContextProps?: Omit<DragDropContextProps, 'children' | 'onDragEnd'>;
        onDragEnd: DragDropContextProps['onDragEnd'];
        droppableId?: string;
        droppableDirection?: Direction;
      }
  );

export const DraggableFormItems: FC<DraggableFormItemsProps> = (props) => {
  const { title, children } = props;

  if ('draggable' in props && props.draggable) {
    const {
      onDragEnd,
      droppableId = 'dnd-list',
      droppableDirection = 'vertical',
    } = props;
    resetServerContext();
    return (
      <DragDropContext {...props.DragDropContextProps} onDragEnd={onDragEnd}>
        <Droppable droppableId={droppableId} direction={droppableDirection}>
          {(provided) => (
            <Group
              {...provided.droppableProps}
              ref={provided.innerRef}
              spacing={0}
              align="center"
              sx={{ border: '1px dashed grey', borderRadius: 3 }}
              p="xs"
            >
              <>
                {title && <Text weight={500}>{title}</Text>}
                {children}
                {provided.placeholder}
              </>
            </Group>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
  return (
    <Box>
      <Stack
        spacing={0}
        align="center"
        sx={{ border: '1px dashed grey', borderRadius: 3 }}
        p="xs"
      >
        {title && <Text weight={500}>{title}</Text>}
        {children}
      </Stack>
    </Box>
  );
};
