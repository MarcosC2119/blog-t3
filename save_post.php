<?php
require 'db.php';
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $errors = [];
    $image_path = null;

    // Validación del título
    if (empty($_POST['title'])) {
        $errors[] = "El título es obligatorio";
    } elseif (strlen($_POST['title']) > 255) {
        $errors[] = "El título no puede exceder los 255 caracteres";
    }

    // Validación del contenido
    if (empty($_POST['content'])) {
        $errors[] = "El contenido es obligatorio";
    }

    // Validación y procesamiento de la imagen
    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $allowed = ['jpg', 'jpeg', 'png', 'gif'];
        $file_extension = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
        
        if (!in_array($file_extension, $allowed)) {
            $errors[] = "Tipo de archivo no permitido. Use: " . implode(', ', $allowed);
        } elseif ($_FILES['image']['size'] > 5000000) {
            $errors[] = "El archivo es demasiado grande (máximo 5MB)";
        } else {
            $image_path = 'uploads/' . uniqid() . '_' . $_FILES['image']['name'];
            if (!move_uploaded_file($_FILES['image']['tmp_name'], $image_path)) {
                $errors[] = "Error al subir la imagen";
            }
        }
    }

    if (empty($errors)) {
        try {
            $stmt = $conn->prepare("INSERT INTO posts (title, content, image) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $_POST['title'], $_POST['content'], $image_path);
            
            if ($stmt->execute()) {
                $_SESSION['success'] = "Post creado exitosamente";
                header("Location: posts.php");
                exit();
            } else {
                $errors[] = "Error al guardar el post: " . $stmt->error;
            }
            $stmt->close();
        } catch (Exception $e) {
            $errors[] = "Error en la base de datos: " . $e->getMessage();
        }
    }

    if (!empty($errors)) {
        $_SESSION['errors'] = $errors;
        header("Location: create.php");
        exit();
    }
}

$conn->close();
?>
