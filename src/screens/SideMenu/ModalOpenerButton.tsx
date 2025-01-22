import { Button } from "@Components/button";
import { Modal, useCurrentModal, useDBValue } from "@Hooks/index";

export function ModalOpenerButton({
  modal,
  label,
  black,
}: {
  modal: Modal;
  label: string;
  black?: boolean;
}) {
  const [, setCurrentModal] = useCurrentModal();

  const onClick = () => setCurrentModal(modal);

  return (
    <Button black={black} onClick={onClick}>
      {label}
    </Button>
  );
}

export function ModalOpenerButtonWithCounter({
  modal,
  label,
  countFn,
}: {
  modal: Modal;
  label: string;
  countFn: () => Promise<string | number>;
}) {
  const count = useDBValue(countFn);

  return <ModalOpenerButton black label={`${label}: ${count}`} modal={modal} />;
}
