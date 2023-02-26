import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

export type SelectOption = {
  label: string;
  value: string | number;
};

type MultipleSelectProps = {
  multiple: true;
  value: SelectOption[];
  onChange: (value: SelectOption[]) => void;
};

type SingleSelectProps = {
  multiple?: false;
  value?: SelectOption;
  onChange: (value: SelectOption | undefined) => void;
};

type SelectProps = {
  options: SelectOption[];
} & (SingleSelectProps | MultipleSelectProps);

export function Select({ multiple, value, onChange, options }: SelectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>();

  function selectOption(option: SelectOption) {
    if (multiple) {
      if (value.includes(option)) {
        // const [option, ...restValues] = value;
        onChange(value.filter((v) => v !== option));
      } else {
        onChange([option, ...value]);
      }
    } else {
      if (option !== value) onChange(option);
    }
  }

  function isOptionSelected(option: SelectOption) {
    if (multiple) {
      return value.includes(option);
    } else {
      return option == value;
    }
  }

  function clearOptions() {
    multiple ? onChange([]) : onChange(undefined);
  }

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target == containerRef.current) {
        switch (e.code) {
          case "Enter":
          case "Space":
            setIsOpen((prev) => !prev);
            if (isOpen) selectOption(options[highlightedIndex || 0]);
            break;

          case "ArrowUp":
          case "ArrowDown": {
            if (!isOpen) {
              setIsOpen(true);
              break;
            }
            if (highlightedIndex) {
              const newIndex =
                highlightedIndex + (e.code === "ArrowDown" ? 1 : -1);
              if (newIndex >= 0 && newIndex < options.length) {
                setHighlightedIndex(newIndex);
              }
            }
            break;
          }
          case "Escape":
            setIsOpen(false);
        }
      }
    };
    containerRef.current?.addEventListener("keydown", handler);

    return () => {
      containerRef.current?.removeEventListener("keydown", handler);
    };
  }, [isOpen, highlightedIndex, options]);

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={styles.container}
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => setIsOpen(false)}
    >
      <span className={styles.value}>
        {multiple
          ? value.map((selectedOption) => {
              return (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    selectOption(selectedOption);
                  }}
                  key={selectedOption.value}
                  className={styles["option-badge"]}
                >
                  {selectedOption.label}
                  <span className={styles["remove-btn"]}>&times;</span>
                </button>
              );
            })
          : value?.label}
      </span>
      <button
        className={styles["clear-btn"]}
        onClick={(e) => {
          e.stopPropagation();
          clearOptions();
        }}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={styles.caret}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((option, index) => {
          return (
            <li
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={(e) => {
                e.stopPropagation();
                selectOption(option);
              }}
              key={option.value}
              className={`${styles.option} ${
                isOptionSelected(option) ? styles.selected : ""
              } ${highlightedIndex == index ? styles.highlighted : ""}`}
            >
              {option.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
