interface Props {
  text: String;
  color?: String; // denote that this property is optional       primary | secondary } ... <-- Enum
  onClick: () => void;
}

function Button({ text, color = "primary", onClick }: Props) {
  return (
    <button type="button" className={"btn btn-" + color} onClick={onClick}>
      {text}
    </button>
  );
}

export default Button;
