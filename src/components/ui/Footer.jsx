function Footer() {
  return (
    <footer style={{
      width: "100%",
      textAlign: "center",
      padding: "1rem 0",
      zIndex: 1,
      position: "relative",
      background: "#832d00",
      color: "white",
      marginTop: "auto"
    }}>
      © {new Date().getFullYear()} Restaurante Maldito. Todos os direitos reservados.
    </footer>
  );
}

export default Footer;