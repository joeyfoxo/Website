<?php
session_start();  // Start the session to use session variables

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Trim and sanitize inputs
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));

    // Validate form fields
    if (empty($name) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $_SESSION['message'] = "Invalid input. Please fill in all fields correctly.";
        header("Location: ../success.html");
        exit();
    }

    // Handle file uploads
    $uploadedFiles = [];
    $uploadDir = 'uploads/';  // Change to your desired upload directory

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true); // Ensure the upload directory exists
    }

    if (!empty($_FILES['attachments']['name'][0])) {
        foreach ($_FILES['attachments']['tmp_name'] as $index => $tmpName) {
            $fileName = basename($_FILES['attachments']['name'][$index]);
            $fileTmpName = $_FILES['attachments']['tmp_name'][$index];
            $fileSize = $_FILES['attachments']['size'][$index];
            $fileType = $_FILES['attachments']['type'][$index];

            $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf', 'docx', '.txt'];
            $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

            // Check file type and size (limit to 5MB)
            if (!in_array($fileExt, $allowedExtensions) || $fileSize > 5 * 1024 * 1024) {
                $_SESSION['message'] = "Invalid file type or size. Only JPG, PNG, PDF, DOCX (max 5MB) allowed.";
                header("Location: ../success");
                exit();
            }

            $filePath = $uploadDir . uniqid() . "_" . $fileName; // Unique file name to prevent conflicts
            if (move_uploaded_file($fileTmpName, $filePath)) {
                $uploadedFiles[] = $filePath;
            }
        }
    }

    // Prepare the email body
    $to = "jamesalawrence.04@gmail.com"; // Change this to your email
    $subject = "New Contact Form Submission";
    $body = "Name: $name\nEmail: $email\nMessage:\n$message\n\n";

    if (!empty($uploadedFiles)) {
        $body .= "Uploaded Files:\n";
        foreach ($uploadedFiles as $filePath) {
            $body .= $filePath . "\n";
        }
    }

    // Email headers
    $headers = "From: noreply@joeyfox.dev\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send the email and redirect with message
    if (mail($to, $subject, $body, $headers)) {
        $_SESSION['message'] = "Your message has been sent successfully!";
    } else {
        $_SESSION['message'] = "There was an error sending your message.";
    }

    // Redirect back to the success page
    header("Location: ../success.html");
    exit();
} else {
    $_SESSION['message'] = "Invalid request.";
    header("Location: ../success.html");
    exit();
}
?>
