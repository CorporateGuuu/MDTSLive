<?php
// === CONFIGURATION ===
$to_email = "sales@nexustechhub.com"; // Your email
$from_name = "Midas Technical Solutions Contact Form";
$smtp_host = "smtp.gmail.com"; // e.g., Gmail, Outlook
$smtp_user = "your-email@gmail.com";   // SMTP login
$smtp_pass = "your-app-password";      // App password (not regular password)
$smtp_port = 587;
$smtp_secure = "tls";

// reCAPTCHA Secret Key
$recaptcha_secret = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";

// === VALIDATE reCAPTCHA ===
if (!isset($_POST['g-recaptcha-response'])) {
    die("reCAPTCHA token missing.");
}

$recaptcha_response = $_POST['g-recaptcha-response'];
$verify = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret={$recaptcha_secret}&response={$recaptcha_response}");
$captcha_result = json_decode($verify);

if (!$captcha_result->success || $captcha_result->score < 0.5) {
    die("Spam detected. Please try again.");
}

// === SANITIZE INPUT ===
function clean($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

$name    = clean($_POST['name']);
$email   = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
$subject = clean($_POST['subject']);
$message = clean($_POST['message']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    die("Invalid email format.");
}

// === BUILD EMAIL ===
$body = "You have a new contact form submission:\n\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Subject: $subject\n\n";
$body .= "Message:\n$message\n";

// === SEND EMAIL VIA SMTP ===
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;

require 'vendor/autoload.php'; // You'll install PHPMailer below

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = $smtp_host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $smtp_user;
    $mail->Password   = $smtp_pass;
    $mail->SMTPSecure = $smtp_secure;
    $mail->Port       = $smtp_port;

    // Recipients
    $mail->setFrom($smtp_user, $from_name);
    $mail->addAddress($to_email);
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(false);
    $mail->Subject = "Contact Form: $subject";
    $mail->Body    = $body;

    $mail->send();
    echo "<!DOCTYPE html><html><head><title>Success</title>
          <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css' rel='stylesheet'>
          </head><body class='bg-light'>
          <div class='container text-center mt-5 p-5 bg-white rounded shadow'>
            <h2 class='text-success'>Thank You!</h2>
            <p>Your message has been sent successfully. We'll reply within 1 hour.</p>
            <a href='index.html' class='btn btn-primary'>Back to Home</a>
          </div></body></html>";
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>
