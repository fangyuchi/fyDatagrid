import React from 'react';
import styled from 'styled-components';
import { getClassName } from './utils';
import Styles from './Styles';
import {
  getCellWidth,
  findDataGridRoot,
  findDataGridHeader
} from './utils';
import {
  useColumnSetter
} from './contexts/columnContext';

const Separator = styled.div<{ direction: string; }>`
  position: absolute;
  border: 1px solid transparent;

  transition: border-color 0.3s;

  ${({ direction }) => {
    return direction === 'left' ? `
      left: 0;

      &:hover {
        border-left-color: #0670ff;
      }
    ` : `
      right: 0;

      &:hover {
        border-right-color: #0670ff;
      }
    `
  }}

  top: 0;
  height: ${Styles.getStyle('header', 'height')}px;
  width: 4px;
  cursor: col-resize;

  // &:hover {

  //   &::after {
  //     content: '|';
  //     display: block;
  //     position: absolute;
  //     color: #ccc;
  //     left: 1px;

  //   }
  // }
`;

type HeaderSeparatorProps = {
  direction: 'right' | 'left',
  fieldName: string;
  onDragStart?: () => void;
  onDragFinish?: () => void;
};

const HeaderSeparator: React.FC<HeaderSeparatorProps> = ({
  direction,
  fieldName,
  onDragStart,
  onDragFinish
}) => {
  const nodeRef = React.useRef<any>(null);
  const initialRef = React.useRef<any>(null);
  const colHeaderElementRef = React.useRef<HTMLElement>(null);
  const colCellElementsRef = React.useRef<HTMLElement[]>(null);
  const fixedCellElementsRef = React.useRef<HTMLElement[]>(null);
  const { setColDefCache } = useColumnSetter();
  // const { colDefCache } = useDataGridContext();

  const setInitialRef = React.useCallback((diff) => {
    initialRef.current = {
      ...initialRef.current,
      ...diff
    };
  }, []);

  const setInitial = React.useCallback(() => {
    if (nodeRef.current) {
      const header = findDataGridHeader(nodeRef.current);
      if (header) {
        const width = getCellWidth(header.style.width);

        initialRef.current = {
          width,
          initialWidth: width
        };

        setColDefCache(fieldName, {
          width
        });
      }
    }
  }, [ setColDefCache, fieldName ]);

  React.useEffect(() => {
    setInitial();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateWidth = React.useCallback((newWidth: number) => {
    // ???????????????
    if (newWidth <= 50) {
      return;
    }

    const cells = colCellElementsRef.current;

    if (Array.isArray(cells) && cells.length) {
      setInitialRef({
        width: newWidth
      });

      cells.forEach(cell => {
        cell.style.width = `${newWidth}px`;
      });
    }

    const initial = initialRef.current;

    if (initial) {
      const { fixed, index, initialWidth, fixedElsInitialScrollThreshold } = initial;

      if (fixed) {
        const fixedCellElements = fixedCellElementsRef.current;
        const widthOffset = newWidth - initialWidth;

        if (Array.isArray(fixedCellElements) && fixedCellElements.length) {
          fixedCellElements.forEach(element => {
            const { dataset: { index: eIndex } } = element;

            // ??????????????????????????????????????????????????????????????????????????????????????????
            if (fixed === 'left' && eIndex > index) {
              const left = getCellWidth(fixedElsInitialScrollThreshold[eIndex]);
              element.style.left = `${left + widthOffset}px`;
            } else if (fixed === 'right' && eIndex < index) {
              const right = getCellWidth(fixedElsInitialScrollThreshold[eIndex]);
              element.style.right = `${right + widthOffset}px`;
            }
          });
        }
      }
    }
  }, [ setInitialRef ]);

  let stopListening = null;

  const handleResizeMouseUp = React.useCallback(e => {
    stopListening && stopListening();
  }, [ stopListening ]);

  const handleResizeMouseMove = React.useCallback(e => {
    
    const initial = initialRef.current;
    const widthOffset = e.clientX - initial.clientX;
    const newWidth = initial.initialWidth + (direction === 'left' ? -widthOffset : widthOffset);

    requestAnimationFrame(() => {
      updateWidth(newWidth)
    });

    // TODO: ?????????????????????stop
  }, [ direction, updateWidth ]);

  const handleColumnResizeMouseDown = React.useCallback((e) => {
    const trigerTarget: HTMLElement = e.currentTarget;
    const headerElement = findDataGridHeader(trigerTarget);

    if (headerElement) {
      e.stopPropagation();
      onDragStart && onDragStart();

      // ??????????????????
      setInitialRef({
        clientX: e.clientX
      });
      // ???????????????header
      colHeaderElementRef.current = headerElement;
      const { dataset } = headerElement;
      const { fixed, index } = dataset;

      if (fieldName) {
        // ???????????????
        const rootElement = findDataGridRoot(trigerTarget);
  
        if (rootElement) {
          colCellElementsRef.current = Array.from(rootElement.querySelectorAll(`[data-field="${getClassName(fieldName)}"]`));

          if (fixed) {
            // ??????????????????fixed???????????? left/right ??????
            fixedCellElementsRef.current = Array.from(rootElement.querySelectorAll(`[data-fixed="${fixed}"]`));

            setInitialRef({
              fixed,
              index,
              // ?????????sticky??????????????????????????????????????????????????????????????????????????????
              fixedElsInitialScrollThreshold: fixedCellElementsRef.current.reduce((acc, el) => {
                const { dataset: { index } } = el;

                if (!acc[index]) {
                  acc[index] = el.style[fixed];
                }

                return acc;
              }, {})
            });
          }
        }
      }

      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleResizeMouseUp);
    }
  }, [ fieldName, setInitialRef, handleResizeMouseMove, handleResizeMouseUp, onDragStart ]);

  stopListening = React.useCallback(() => {
    document.body.style.removeProperty('cursor');
    document.body.style.removeProperty('user-select');
    document.removeEventListener('mousemove', handleResizeMouseMove);
    document.removeEventListener('mouseup', handleResizeMouseUp);

    colHeaderElementRef.current = null;
    colCellElementsRef.current = null;
    fixedCellElementsRef.current = null;
    setInitial();
    onDragFinish && onDragFinish();
  }, [ handleResizeMouseMove, handleResizeMouseUp, setInitial, onDragFinish ]);

  return (
    <Separator 
      onMouseDown={handleColumnResizeMouseDown}
      ref={nodeRef}
      direction={direction}
    />
  );
};

export default React.memo(HeaderSeparator);
