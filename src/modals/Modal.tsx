import { Button } from "@Components/button";
import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { useEffect, useRef } from "react";
import styled from "styled-components";

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
}: {
  body: () => JSX.Element;
  header: () => JSX.Element;
  footer: () => JSX.Element;
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

  return (
    <Container ref={containerRef}>
      <Header style={{ alignSelf: "start" }}>{header()}</Header>
      <Body>{body()}</Body>
      <Footer style={{ alignSelf: "end" }}>{footer()}</Footer>
    </Container>
  );
}

export function ModalCloseButton() {
  return <Button>X</Button>;
}
