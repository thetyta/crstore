function Footer() {
  return (
    <footer style={{
      width: "100%",
      textAlign: "center",
      padding: "1rem 0",
      zIndex: 1,
      position: "relative",
      background: "#dedede",
      color: "#404040",
      marginTop: "auto"
    }}>
      © {new Date().getFullYear()} Restaurante Maldito. Todos os direitos reservados.
    </footer>
  );
}

export default Footer;