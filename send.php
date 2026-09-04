<?php
$to = 'bud-bud777@mail.ru';
$subject = 'Новая заявка с сайта "Боги красоты"';
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$phone = $_POST['phone'] ?? '';
$message = $_POST['message'] ?? '';

$body = "Имя: $name\nEmail: $email\nТелефон: $phone\nСообщение:\n$message";

$headers = "From: $email\r\nReply-To: $email\r\n";

if (mail($to, $subject, $body, $headers)) {
    // Redirect to thank-you page or show success message
    header('Location: /thank-you.html');
    exit();
} else {
    echo "<p>Ошибка при отправке сообщения. Пожалуйста, попробуйте позже.</p>";
}
?>