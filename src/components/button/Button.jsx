import styles from "./button.module.css";

// Komponenten tager imod 3 props fra dens parentkomponent. Der tildeles en ekstra klasse hvis variant sendes med. Denne styles der på i module.css.
const Button = ({ buttonText, onClick, variant = "default" }) => {
  return (
    <button className={`${styles.button} ${styles[variant]}`} onClick={onClick}>
      <p>{buttonText}</p>
    </button>
  );
};

export default Button;
