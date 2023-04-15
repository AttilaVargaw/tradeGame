import Button from "react-bootstrap/esm/Button";
import styled from "styled-components";

export type SideMenuItemProps = {
  label: string;
  onClick: () => void;
};

export function SideMenuItem({ label, onClick }: SideMenuItemProps) {
  return (
    <Button variant="primary" onClick={onClick} size="lg">
      {label}
    </Button>
  );
}

export default styled.div`
  position: fixed;
  right: 0;
  z-index: 11;
  background: #fffa;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 1em;
`;
