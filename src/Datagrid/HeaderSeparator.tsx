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
    // 也不能太小
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

            // 如果是固定列单元格，则下标大于当前元素的列要调整，右侧则相反
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

    // TODO: 拖到外面的话也stop
  }, [ direction, updateWidth ]);

  const handleColumnResizeMouseDown = React.useCallback((e) => {
    const trigerTarget: HTMLElement = e.currentTarget;
    const headerElement = findDataGridHeader(trigerTarget);

    if (headerElement) {
      e.stopPropagation();
      onDragStart && onDragStart();

      // 设置起始参数
      setInitialRef({
        clientX: e.clientX
      });
      // 触发拖拽的header
      colHeaderElementRef.current = headerElement;
      const { dataset } = headerElement;
      const { fixed, index } = dataset;

      if (fieldName) {
        // 获取根节点
        const rootElement = findDataGridRoot(trigerTarget);
  
        if (rootElement) {
          colCellElementsRef.current = Array.from(rootElement.querySelectorAll(`[data-field="${getClassName(fieldName)}"]`));

          if (fixed) {
            // 也要同步更新fixed单元格的 left/right 属性
            fixedCellElementsRef.current = Array.from(rootElement.querySelectorAll(`[data-fixed="${fixed}"]`));

            setInitialRef({
              fixed,
              index,
              // 初始的sticky滚动阈值保存一份，这样就不需要一直读取目标元素的属性
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
