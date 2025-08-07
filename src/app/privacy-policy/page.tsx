'use client'

import { ArrowBack, Security } from '@mui/icons-material'
import { Box, Container, Paper, Typography } from '@mui/material'
import VibrateIconButton from '@/components/common/VibrateIconButton'
import Logo from '@/components/Logo'

const PrivacyPolicyPage = () => {
  return (
    <Container
      maxWidth='md'
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 4, pb: 6, minHeight: '100vh' }}
    >
      <Paper sx={{ p: 2, borderRadius: 2 }} elevation={5}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0 }}>
          <Logo size={50} />
          <Typography
            component='h1'
            variant='h4'
            sx={{ textAlign: 'center', m: 0, p: 0, fontWeight: 100, textTransform: 'uppercase' }}
          >
            latespottr
          </Typography>
        </Box>
      </Paper>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <VibrateIconButton
          color='primary'
          onClick={() => {
            window.location.href = '/'
          }}
        >
          <ArrowBack />
        </VibrateIconButton>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Security color='primary' />
          <Typography variant='h6' component='h1'>
            Integritetspolicy
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant='h5' sx={{ mb: 3, fontWeight: 500 }}>
          Integritetspolicy för Platespottr
        </Typography>

        <Typography variant='body1' sx={{ mb: 3 }}>
          Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              1. Introduktion
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Denna integritetspolicy beskriver hur Platespottr samlar in, använder och skyddar din personliga
              information. Vi är engagerade i att skydda din integritet och säkerställa att din personliga data hanteras
              på ett säkert och transparent sätt enligt gällande dataskyddslagar, inklusive GDPR.
            </Typography>
          </section>

          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              2. Vilken information samlar vi in?
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Vi samlar endast in den information som är nödvändig för att tillhandahålla vår tjänst:
            </Typography>
            <Box component='ul' sx={{ pl: 3, mb: 2 }}>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                <strong>Kontoinformation:</strong> Användarnamn och PIN-kod (krypterad)
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                <strong>Speldata:</strong> Registreringsnummer du har hittat och när du hittade dem
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                <strong>Vänförbindelser:</strong> Information om dina vänner i appen
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                <strong>App-inställningar:</strong> Språk, tema och andra användarpreferenser
              </Typography>
            </Box>
          </section>

          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              3. Hur använder vi din information?
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Vi använder din information för att:
            </Typography>
            <Box component='ul' sx={{ pl: 3, mb: 2 }}>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                Tillhandahålla och förbättra vår tjänst
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                Hantera ditt konto och speldata
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                Visa statistik och topplistor
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                Hantera vänförbindelser
              </Typography>
            </Box>
          </section>

          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              4. Delning av information
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Vi delar inte din personliga information med tredje part, förutom:
            </Typography>
            <Box component='ul' sx={{ pl: 3, mb: 2 }}>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                Med dina vänner i appen (endast användarnamn och speldata)
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                När det krävs enligt lag
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                För att skydda våra rättigheter eller användarnas säkerhet
              </Typography>
            </Box>
          </section>

          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              5. Datasäkerhet
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Vi implementerar lämpliga tekniska och organisatoriska säkerhetsåtgärder för att skydda din information:
            </Typography>
            <Box component='ul' sx={{ pl: 3, mb: 2 }}>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                Kryptering av känslig data
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                Säker överföring av data (HTTPS)
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                Regelbunden säkerhetsuppdateringar
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                Begränsad åtkomst till personlig data
              </Typography>
            </Box>
          </section>

          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              6. Dina rättigheter
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Enligt GDPR har du rätt att:
            </Typography>
            <Box component='ul' sx={{ pl: 3, mb: 2 }}>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                <strong>Åtkomst:</strong> Begära information om vilken data vi har om dig
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                <strong>Rättelse:</strong> Korrigera felaktig information
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                <strong>Radering:</strong> Ta bort ditt konto och all din data
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                <strong>Portabilitet:</strong> Få en kopia av din data
              </Typography>
              <Typography component='li' variant='body1' sx={{ mb: 1 }}>
                <strong>Insyn:</strong> Begränsa hur vi använder din data
              </Typography>
            </Box>
          </section>

          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              7. Cookies och spårning
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Vi använder endast nödvändiga cookies för att appen ska fungera korrekt. Vi spårar inte din aktivitet för
              reklam eller andra kommersiella syften.
            </Typography>
          </section>

          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              8. Barns integritet
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Vi samlar inte medvetet in personlig information från barn under 13 år. Om du är förälder och tror att
              ditt barn har gett oss personlig information, kontakta oss omedelbart.
            </Typography>
          </section>

          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              9. Ändringar i denna policy
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Vi kan uppdatera denna integritetspolicy från tid till annan. Din fortsatta användning av appen efter
              ändringar utgör ditt samtycke till den uppdaterade policyn.
            </Typography>
          </section>

          <section>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 500 }}>
              10. Kontakta oss
            </Typography>
            <Typography variant='body1' sx={{ mb: 2 }}>
              Om du har frågor om denna integritetspolicy eller hur vi hanterar din personliga information, kontakta oss
              på:
            </Typography>
            <Typography variant='body1' sx={{ mb: 2, fontStyle: 'italic' }}>
              E-post: magnus.claesson+platespottr@gmail.com
            </Typography>
          </section>

          <Box
            sx={{
              mt: 4,
              p: 3,
              backgroundColor: 'background.default',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography variant='body2' color='text.secondary' sx={{ textAlign: 'center' }}>
              <strong>Viktigt:</strong> Din säkerhet och integritet är vår högsta prioritet. Vi är engagerade i att
              skydda din information och följa alla gällande dataskyddslagar.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default PrivacyPolicyPage
