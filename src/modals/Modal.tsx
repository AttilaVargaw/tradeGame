import { useCurrentModal } from "@Components/hooks/useCurrentModal";
import { useEffect, useRef } from "react";
import styled from "styled-components";

export const Container = styled.div`
  inset: 2em;
  z-index: 100000;
  position: absolute;
  display: flex;
  flex-direction: column;
  border-radius: 0.5em;
  background: darkgray;
  border: 1px solid #111;
`;

export const Body = styled.div`
  height: 100%;
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
    function ClickEvenListener(this: Window, { target }: MouseEvent) {
      if (
        target &&
        containerRef.current &&
        !(containerRef.current as Node).contains(target as Node)
      ) {
        setCurrentModal(null);
      }
    }
    window.addEventListener("click", ClickEvenListener);

    return () => window.removeEventListener("click", ClickEvenListener);
  }, [setCurrentModal]);

  return (
    <Container ref={containerRef}>
      <Header>{header()}</Header>
      <Body>{body()}</Body>
      <Footer>{footer()}</Footer>
    </Container>
  );
}
