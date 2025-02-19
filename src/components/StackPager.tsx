import { useEffect, useState } from "react";
import styled from "styled-components";

import { CreateInnerFromChildrenOrInnerHTML } from "@Services/utils";

import { PagerProps } from "./pagerProps";
import { Toggle } from "./toggle";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
`;

export function StackPager<T = string | number>({
  onChange,
  values,
  ItemTemplate = Toggle,
  selected,
}: PagerProps<T>) {
  const [innerSelected, setInnerSelected] = useState<T | null>(
    selected ?? null
  );

  const onClick = (value: T) => () => {
    setInnerSelected(value);
    onChange(value);
  };

  useEffect(() => {
    setInnerSelected(selected ?? null);
  }, [selected]);

  return (
    <Container>
      {values.map(({ label, value, dangerouslySetInnerHTML }) => (
        <ItemTemplate
          value={value}
          key={String(value)}
          active={innerSelected === value}
          onChange={onClick(value)}
          style={{ width: "100%" }}
          {...CreateInnerFromChildrenOrInnerHTML(
            label,
            dangerouslySetInnerHTML
          )}
        />
      ))}
    </Container>
  );
}
