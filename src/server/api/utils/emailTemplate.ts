export const emailTemplate = (usuarioSolicitante: string) => {
  return `
     <!doctype html>
  <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  <head>
      <title></title>
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style type="text/css">
          body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { border-collapse: collapse; }
          img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
          p { display: block; margin: 13px 0; }
      </style>
  </head>
  
  <body style="background-color:#f9f9f9;">
      <div style="background-color:#f9f9f9;">
          <div style="background:#2F67F6; Margin:0px auto; max-width:600px; padding-top:35px;"> 
              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#fff; background-color:#fff; width:100%;">
                  <tbody>
                      <tr>
                          <td style="border:#dddddd solid 1px; border-top:0px; direction:ltr; font-size:0px; padding:20px 0; text-align:center; vertical-align:top;">
                              <div style="font-size:13px; text-align:left; direction:ltr; display:inline-block; vertical-align:bottom; width:100%;">
                                  <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                   
                                      <tr>
                                          <td>
                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:28px;font-weight:bold;line-height:1;text-align:center;color:#555;">
                                                  ¡Hola, ${usuarioSolicitante}!
                                              </div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                                              <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:16px;line-height:22px;text-align:center;color:#555;margin-top:10px;">
                                                  <strong>Has reservado un libro.</strong><br>Gracias por usar nuestro sistema de reservas de la biblioteca.
                                              </div>
                                          </td>
                                      </tr>
                                      <tr>
                                          <td align="center" style="font-size:0px;padding:10px 25px;padding-top:30px;padding-bottom:50px;word-break:break-word;">
                                              <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                  <tr>
                                                      <td align="center" bgcolor="#2F67F6" role="presentation" style="border:none;border-radius:3px;color:#ffffff;cursor:auto;padding:15px 25px;" valign="middle">
                                                          <a href="https://sge-2.vercel.app/" style="background:#2F67F6;color:#ffffff;font-family:'Helvetica Neue',Arial,sans-serif;font-size:15px;font-weight:normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;">
                                                              <strong>Ver más detalles</strong>
                                                          </a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </div>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
  </body>
  </html>
  
      `;
};
