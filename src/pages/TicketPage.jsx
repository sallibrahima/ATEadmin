import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Calendar,
  MapPin,
  Clock,
  User,
  Mail,
  Phone
} from "lucide-react";

const TicketPage = () => {
  const [registrationData, setRegistrationData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('visitorRegistration');
    if (!data) {
      navigate('/InscriptionVisiteur');
      return;
    }
    try {
      const parsedData = JSON.parse(data);
      setRegistrationData(parsedData);
    } catch {
      navigate('/InscriptionVisiteur');
    }
  }, [navigate]);

  const downloadTicket = () => {
    if (!registrationData) return;

    // Générer QR code en Data URL via canvas temporaire
    // Pour éviter d'importer une autre lib, on va créer un canvas en JS pour générer le QR
    // Mais ici, on simplifie : on génère la même donnée QR dans la page imprimée en base64 avec qrcode.react

    // On prépare les données pour QR Code JSON
    const qrData = JSON.stringify({
      ticketId: registrationData.ticketId,
      name: `${registrationData.firstName} ${registrationData.lastName}`,
      email: registrationData.email,
      event: "AFRINOV TECH EXPO 2025"
    });

    // On ouvre une nouvelle fenêtre pour le ticket à imprimer
    const ticketWindow = window.open('', '_blank');
    if (!ticketWindow) return;

    // Template HTML complet, CSS inline, inclus QR code sous forme de <img> base64 généré à la volée
    // Pour cela, on utilise qrcode.js (CDN) dans la page pour générer le QR dans la page imprimée
    const ticketHtml = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8" />
        <title>Ticket AFRINOV TECH EXPO</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(135deg, #7C3AED, #A855F7);
            min-height: 100vh;
          }
          .ticket {
            background: white;
            max-width: 600px;
            margin: 0 auto;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #7C3AED, #A855F7);
            color: white;
            padding: 30px;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .event-title {
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
          }
          .content {
            padding: 30px;
          }
          .ticket-info {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          .user-info {
            display: grid;
            gap: 15px;
          }
          .info-row {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
          }
          .info-label {
            font-weight: bold;
            color: #666;
            min-width: 120px;
          }
          .qr-section {
            text-align: center;
          }
          .qr-code {
            
            border-radius: 10px;
            padding: 0px;
            background: white;
            width: 100px;
            height: 100px;
            display: inline-block;
          }
          .ticket-id {
            font-family: monospace;
            font-size: 14px;
            color: #666;
            margin-top: 10px;
          }
          .event-details {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
          }
          .event-details h3 {
            margin: 0 0 15px 0;
            color: #7C3AED;
          }
          .footer {
            text-align: center;
            color: #666;
            font-size: 12px;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          @media print {
            body { background: white; }
            .ticket { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="logo"> AFRINOV TECH EXPO</div>
            <br> </br>
            <div class="event-title">PASS VISITEUR</div>
           
          </div>
          <div class="content">
            <div class="ticket-info">
              <div class="user-info">
                <div class="info-row"><span class="info-label">Nom :</span><span>${registrationData.firstName} ${registrationData.lastName}</span></div>
                <div class="info-row"><span class="info-label">Email :</span><span>${registrationData.email}</span></div>
                <div class="info-row"><span class="info-label">Profession :</span><span>${registrationData.profession}</span></div>
                <div class="info-row"><span class="info-label">Téléphone :</span><span>+224 ${registrationData.phone}</span></div>
                <div class="info-row"><span class="info-label">Adresse :</span><span>${registrationData.address}</span></div>
              </div>
              <div class="qr-section">
                <canvas id="qrCanvas" class="qr-code"></canvas>
                <div class="ticket-id">ID: ${registrationData.ticketId}</div>
              </div>
            </div>
            <div class="event-details">
              <h3>Détails de l'Événement</h3>
              <div class="info-row"><span class="info-label">Date :</span><span>15-17 Mars 2025</span></div>
              <div class="info-row"><span class="info-label">Lieu :</span><span>Centre de Conférence Kaloum, Conakry</span></div>
              <div class="info-row"><span class="info-label">Horaires :</span><span>09h00 - 18h00</span></div>
            </div>
            <div class="footer">
              <p>Présentez ce ticket à l'entrée • Inscription validé par SALL IBRAHIM</p>
              <p>© 2025 Afrinov Tech Expo. Tous droits réservés.</p>
            </div>
          </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
        <script>
          const qrData = ${JSON.stringify(qrData)};
          QRCode.toCanvas(document.getElementById('qrCanvas'), qrData, { width: 200 }, function (error) {
            if (error) console.error(error);
            else window.print();
          });
        </script>
      </body>
      </html>
    `;

    ticketWindow.document.write(ticketHtml);
    ticketWindow.document.close();
  };

  if (!registrationData) return null;

  const qrDataForRender = JSON.stringify({
    ticketId: registrationData.ticketId,
    name: `${registrationData.firstName} ${registrationData.lastName}`,
    email: registrationData.email,
    event: "AFRINOV TECH EXPO 2025"
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-700 to-indigo-800 flex flex-col justify-center items-center p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-background/95 backdrop-blur-sm border-0 shadow-elegant">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="mx-auto flex flex-col items-center">
              <img
                src="https://storage.googleapis.com/hostinger-horizons-assets-prod/450ab5d6-6205-4dde-ae91-ca6c3511d636/dd327866bb331639858978fd3fbe5173.png"
                alt="Afrinov Tech Expo Logo"
                className="h-12 object-contain"
              />
              <Badge variant="secondary" className="mt-2">
                PASS VISITEUR
              </Badge>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Votre ticket est prêt !</h1>
              <br></br>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Informations Personnelles
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{registrationData.firstName} {registrationData.lastName}</p>
                      <p className="text-sm text-muted-foreground">{registrationData.profession}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{registrationData.email}</p>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">+224 {registrationData.phone}</p>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{registrationData.address}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">

                  <div className="inline-block p-4 bg-white rounded-xl border-2 border-primary/20">
                    <QRCode
                      value={qrDataForRender}
                      size={192}
                      fgColor="#7C3AED"
                      bgColor="#FFFFFF"
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 font-mono">
                    ID: {registrationData.ticketId}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-muted/30 p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Détails de l'Événement
              </h3>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">15-17 Mars 2025</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Lieu</p>
                    <p className="text-sm text-muted-foreground">Centre Kaloum, Conakry</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Horaires</p>
                    <p className="text-sm text-muted-foreground">09h00 - 18h00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center pt-4">
              <Button
                onClick={downloadTicket}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-base flex justify-center items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Télécharger le ticket
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                Présentez ce ticket à l'entrée de l'événement
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TicketPage;
