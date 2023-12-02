import { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";

import { Button } from "@Components/button";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { Router, RouterProps } from "@Components/router";

export const Container = styled.div`
  z-index: 100000;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 0.5em;
  background: darkgray;
  border: 1px solid #111;
  inset: 2em;
  justify-content: space-between;
  padding: 2em;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
`;

export const Body = styled.div`
  height: 80vh;
  width: 100%;
`;

export const Header = styled.div`
  width: 100%;
`;

export const Footer = styled.div`
  width: 100%;
`;

export default function Modal({
  body,
  header,
  footer,
  subPages,
  currentSubpage,
  hideCloseButton = false,
}: {
  body?: React.ReactElement | boolean;
  header?: React.ReactElement | boolean;
  footer?: React.ReactElement | boolean;
  subPages?: RouterProps;
  currentSubpage?: string;
  hideCloseButton?: boolean;
}) {
  const [, setCurrentModal] = useCurrentModal();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function ClickEvenListener(this: Window, event: MouseEvent) {
      if (
        event.target &&
        containerRef.current &&
        !(containerRef.current as Node).contains(event.target as Node)
      ) {
        setCurrentModal(null);
      }
    }
    window.addEventListener("click", ClickEvenListener, true);

    return () => window.removeEventListener("click", ClickEvenListener);
  }, [setCurrentModal]);

  const onCloseButtonCLick = useCallback(
    () => setCurrentModal(null),
    [setCurrentModal]
  );

  return (
    <Container ref={containerRef}>
      <div style={{ display: "flex", margin: "0.5em" }}>
        <Header style={{ alignSelf: "start" }}>{header}</Header>
        {!hideCloseButton && <ModalCloseButton onClick={onCloseButtonCLick} />}
      </div>
      {subPages && currentSubpage ? (
        <Router pages={subPages} value={currentSubpage} />
      ) : (
        <Body>{body}</Body>
      )}
      <Footer style={{ alignSelf: "end" }}>{footer}</Footer>
    </Container>
  );
}

export function ModalCloseButton(props: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      style={{ ...props, aspectRatio: 1, borderRadius: "100% 100% 100% 100%" }}
      size="normal"
    >
      X
    </Button>
  );
}
