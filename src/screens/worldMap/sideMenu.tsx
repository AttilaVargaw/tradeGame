import { FC, PropsWithChildren } from "react";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";

export type SideMenuItemProps = {
    label: string
    onClick: () => void
}

export const SideMenuItem: FC<SideMenuItemProps> = ({ label, onClick }) => {
    return <Button variant="primary" onClick={onClick} size="lg">
        {label}
    </Button>
}

type SideMenuProps = {

}

export default function SideMenu({ children }: PropsWithChildren<SideMenuProps>): JSX.Element {
    return <Container className="d-grid gap-2">
        {children}
    </Container>
}
