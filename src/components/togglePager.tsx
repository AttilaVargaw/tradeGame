import { useCallback, useState } from "react";
import { styled } from "styled-components";

import { Grid } from "./grid";
import { PagerProps } from "./pagerProps";
import { Toggle } from "./toggle";

const HorizonatalPager = styled.div`
  position: fixed;
  right: 0;
  background: darkgray;
  border: 1px 1px 1px 1px solid #111;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
  z-index: 1000;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

export function TogglePager<T = string>({
  values,
  onChange,
  selected,
  ItemTemplate = Toggle,
}: PagerProps<T>) {
  const [innerSelected, setInnerSelected] = useState<T | null>(
    selected ?? null
  );

  const onClick = useCallback(
    (value: T) => () => {
      setInnerSelected(value);
      onChange(value);
    },
    [onChange]
  );

  return (
    <Grid $num={values.length}>
      {values.map(({ label, value, dangerouslySetInnerHTML }) => (
        <ItemTemplate
          key={String(value)}
          active={innerSelected === value}
          onChange={onClick(value)}
          style={{ width: "100%" }}
          {...{
            dangerouslySetInnerHTML,
            children: dangerouslySetInnerHTML ? undefined : label,
          }}
        />
      ))}
    </Grid>
  );
}
