<?php
try {
    $conn = new mysqli("localhost", "root", "", "DBblog");
    
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    // Establecer charset utf8
    if (!$conn->set_charset("utf8")) {
        throw new Exception("Error cargando el conjunto de caracteres utf8: " . $conn->error);
    }

} catch (Exception $e) {
    die("Error: " . $e->getMessage());
}

// Función para limpiar la conexión
function closeConnection() {
    global $conn;
    if (isset($conn) && $conn instanceof mysqli) {
        $conn->close();
    }
}

// Registrar la función para que se ejecute al finalizar el script
register_shutdown_function('closeConnection');
?>
