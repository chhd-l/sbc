import React, { Component } from 'react';
export default class GeneralTerms extends Component<any, any> {
  render() {
    const styles = {
      style1: {
        fontSize: '14pt',
        lineHeight: '108%',
        margin: '0pt 0pt 8pt',
        textAlign: 'justify'
      },
      style2: {
        fontFamily:
          'RC TYPE Black,RC TYPE,Roboto,Avenir,Helvetica,Arial,sans-serif',
        fontSize: '14pt',
        fontWeight: 'bold'
      },
      style3: {
        fontFamily:
          'RC TYPE Black,RC TYPE,Roboto,Avenir,Helvetica,Arial,sans-serif',
        fontSize: '14pt'
      },
      style4: {
        fontFamily:
          'RC TYPE Black,RC TYPE,Roboto,Avenir,Helvetica,Arial,sans-serif',
        fontSize: '14pt',
        fontStyle: 'italic',
        fontWeight: 'bold'
      },
      style5: {
        backgroundColor: '#ffff00',
        fontFamily:
          'RC TYPE Black,RC TYPE,Roboto,Avenir,Helvetica,Arial,sans-serif',
        fontSize: '14pt'
      },
      style6: {
        backgroundColor: '#ffff00',
        fontFamily:
          'RC TYPE Black,RC TYPE,Roboto,Avenir,Helvetica,Arial,sans-serif',
        fontSize: '14pt',
        fontWeight: 'bold'
      },
      style7: {
        fontFamily:
          'RC TYPE Black,RC TYPE,Roboto,Avenir,Helvetica,Arial,sans-serif',
        fontSize: '14pt',
        textDecoration: 'underline'
      }
    } as any;
    return (
      <div style={{ height: '100vh', overflowY: 'auto' }}>
        <div style={{ width: 900, margin: '50px auto', color: '#000' }}>
          <svg
            style={{ width: 200, margin: '10px auto 20px', display: 'block' }}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 220 101.83"
          >
            <title>Royal Canin logo - primary</title>
            <g id="Crown">
              <g>
                <path
                  style={{ fill: '#e2001a' }}
                  d="M81.22,42.83a2.16,2.16,0,0,1-1.87-1,2.41,2.41,0,0,1,.44-3.3c6.26-4.62,15.83-7.47,25.61-7.47h0c9.78,0,19.23,2.75,25.5,7.47a2.3,2.3,0,0,1,.44,3.3,2.4,2.4,0,0,1-3.3.44c-4.18-3.19-12.42-6.48-22.75-6.48h0c-10.33,0-18.57,3.41-22.75,6.48A2,2,0,0,1,81.22,42.83Zm2.09,4a1.53,1.53,0,0,0,1-.33c4.73-4,12.86-6.37,21-6.37s16,2.42,20.88,6.37a1.64,1.64,0,0,0,2.09-2.53c-5.39-4.4-14-7.14-23-7.14S87.7,39.43,82.21,43.93A1.69,1.69,0,0,0,82,46.24,1.74,1.74,0,0,0,83.31,46.79ZM70.78,12.94a5,5,0,0,0-2.75.77A5.88,5.88,0,0,0,65.5,17a5.75,5.75,0,0,0,.55,4.07,5.39,5.39,0,0,0,4.62,2.64h0a5,5,0,0,0,2.75-.77,5.88,5.88,0,0,0,2.53-3.3,5.75,5.75,0,0,0-.55-4.07A5.39,5.39,0,0,0,70.78,12.94Zm34.51,4.18a5.39,5.39,0,1,0,5.39,5.39A5.39,5.39,0,0,0,105.29,17.12Zm0-13.52A5.39,5.39,0,1,0,110.67,9,5.39,5.39,0,0,0,105.29,3.6ZM91,19a6.43,6.43,0,0,0-1.43.22,5.28,5.28,0,0,0-3.74,6.59,5.41,5.41,0,0,0,5.17,4h.11a5.52,5.52,0,0,0,1.32-.22A5.44,5.44,0,0,0,95.73,27a5.83,5.83,0,0,0,.55-4.07A5.64,5.64,0,0,0,91,19ZM77.59,24.59a5,5,0,0,0-2.75.77,5.88,5.88,0,0,0-2.53,3.3,5.75,5.75,0,0,0,.55,4.07,5.39,5.39,0,0,0,4.62,2.64h0a5,5,0,0,0,2.75-.77,5.88,5.88,0,0,0,2.53-3.3,5.75,5.75,0,0,0-.55-4.07A5.14,5.14,0,0,0,77.59,24.59Zm43.52-5.39a6.43,6.43,0,0,0-1.43-.22,5.37,5.37,0,0,0-1.43,10.55,6.43,6.43,0,0,0,1.43.22,5.37,5.37,0,0,0,1.43-10.55Zm3.52-13.08a6.43,6.43,0,0,0-1.43-.22,5.37,5.37,0,0,0-1.43,10.55,6.43,6.43,0,0,0,1.43.22,5.31,5.31,0,0,0,5.17-4A5.2,5.2,0,0,0,124.63,6.13Zm11.1,19.23a6.08,6.08,0,0,0-2.75-.77,5.26,5.26,0,0,0-4.62,2.64,4.8,4.8,0,0,0-.55,4.07,5.07,5.07,0,0,0,2.53,3.3,6.08,6.08,0,0,0,2.75.77,5.39,5.39,0,0,0,4.62-2.64,4.85,4.85,0,0,0,.55-4.07A4.83,4.83,0,0,0,135.73,25.36ZM145.18,17a5.07,5.07,0,0,0-2.53-3.3,6.08,6.08,0,0,0-2.75-.77,5.39,5.39,0,0,0-4.62,2.64,4.85,4.85,0,0,0-.55,4.07,5.07,5.07,0,0,0,2.53,3.3,6.08,6.08,0,0,0,2.75.77,5.26,5.26,0,0,0,4.62-2.64A5.75,5.75,0,0,0,145.18,17Zm-57.81-.22a6.43,6.43,0,0,0,1.43-.22A5.37,5.37,0,0,0,87.37,6a6.43,6.43,0,0,0-1.43.22,5.28,5.28,0,0,0-3.74,6.59,5.54,5.54,0,0,0,5.17,4ZM179.8,77A3.08,3.08,0,1,0,186,77V55.36a3.08,3.08,0,0,0-6.15,0Zm-89-3a.29.29,0,0,1-.33-.33V55.8a3.08,3.08,0,0,0-6.15,0V78.11a1.62,1.62,0,0,0,1.65,1.65H96.61a2.86,2.86,0,0,0,0-5.71Zm72.43-19.12h0a3.79,3.79,0,0,0-3.63-2,3.89,3.89,0,0,0-3.85,3.85V77.23a2.86,2.86,0,0,0,3,2.86,2.93,2.93,0,0,0,3-2.86V64.71a.24.24,0,0,1,.22-.22l.11.11,7.47,13.19a3.71,3.71,0,0,0,3.3,2,3.89,3.89,0,0,0,3.85-3.85V55a2.86,2.86,0,0,0-5.71,0V67.56l-.22.22-.11-.11Zm33.52,0h0a3.79,3.79,0,0,0-3.63-2,3.89,3.89,0,0,0-3.85,3.85V77.34a2.86,2.86,0,0,0,3,2.86,2.93,2.93,0,0,0,3-2.86V64.82a.24.24,0,0,1,.22-.22l.11.11L203,77.89a3.71,3.71,0,0,0,3.3,2A3.89,3.89,0,0,0,210.14,76V55.14a2.86,2.86,0,0,0-5.71,0V67.67l-.22.22-.11-.11Zm-142,6a.4.4,0,0,1-.33-.11l-6.7-7a2.81,2.81,0,0,0-2.09-.88,2.91,2.91,0,0,0-2.86,2.86,2.65,2.65,0,0,0,.77,1.87L51.65,67l.11,9.89a2.86,2.86,0,0,0,5.71,0L57.59,67l8.13-9.34a3.12,3.12,0,0,0,.77-1.87,2.91,2.91,0,0,0-2.86-2.86,3,3,0,0,0-2.09.88l-6.59,7C55,61,54.84,61,54.73,61ZM31.87,59.21a7.25,7.25,0,1,1-7.25,7.25A7.25,7.25,0,0,1,31.87,59.21Zm13.41,7.25A13.41,13.41,0,1,0,31.87,79.87,13.32,13.32,0,0,0,45.28,66.46Zm96.28,1.76h0c0,.22-.11.33-.22.33h-2.75v-4.4Zm-3.63-14.4a3.09,3.09,0,0,0-2.31-1.1c-1.65,0-3.08.88-3.08,2.53V76.79a3,3,0,0,0,3,3,3.05,3.05,0,0,0,3.08-3V74.38H146L149,78.55a3,3,0,0,0,2.31,1.21,2.84,2.84,0,0,0,2.86-2.86,3.32,3.32,0,0,0-.55-1.76ZM74.62,64.16v4.4H71.88a.24.24,0,0,1-.22-.22v-.11Zm-15.17,11a3,3,0,0,0-.55,1.76,2.84,2.84,0,0,0,2.86,2.86,2.72,2.72,0,0,0,2.31-1.21l3.08-4.18h7.36v2.42a3.05,3.05,0,0,0,3.08,3,3,3,0,0,0,3-3v-21a3.15,3.15,0,0,0-3.08-3.08,3.09,3.09,0,0,0-2.31,1.1Zm48.14-8.57A13.31,13.31,0,0,0,120.23,80c3.85,0,7.91-1.65,10.11-4.29a2.77,2.77,0,0,0,.66-1.87,2.85,2.85,0,0,0-4.18-2.53l-2.31,1.54a6.58,6.58,0,0,1-3.85,1.1,7.37,7.37,0,0,1,0-14.73,7.49,7.49,0,0,1,3.85,1.1l2.31,1.54A2.85,2.85,0,0,0,131,59.32a3,3,0,0,0-.66-1.87A11.9,11.9,0,0,0,121,53.28,13.23,13.23,0,0,0,107.6,66.57ZM8.68,59.1A3.06,3.06,0,0,1,11.87,62a3,3,0,0,1-3.19,2.86A3,3,0,0,1,5.5,62.07,3.08,3.08,0,0,1,8.68,59.1ZM.44,77A2.91,2.91,0,0,0,3.3,79.87,2.91,2.91,0,0,0,6.15,77l.11-7.14a.35.35,0,0,1,.33-.33H6.7l7,9.56a2.65,2.65,0,0,0,1.87.77,2.82,2.82,0,0,0,2.86-2.75,2.22,2.22,0,0,0-.33-1.21L13.74,69a7.72,7.72,0,0,0,3.85-6.81,8.77,8.77,0,0,0-8.68-9,8.66,8.66,0,0,0-6.59,2.31C.55,57.12,0,59.54,0,62.18Zm196.18,21.1V90.64h1.1v6.48h3.63v1Zm-5.06,0h1.1V90.64h-1.1ZM185.3,92.4l-1.21,3.3h2.31Zm2,5.71-.55-1.54h-3l-.55,1.54H182l2.75-7.47h.88l2.75,7.47Zm-9-6.37v6.37h-1.1V91.63h-2.09v-1h5.28v1l-2.09.11Zm-10.88,6.37V90.64h4.84v1h-3.63v2.2h3.08v1h-3.08v2.31h3.63v1Zm-4.84-3.74c0-1,0-1.76-.44-2.2a1.82,1.82,0,0,0-1.32-.55h-1.43v5.5h1.43a1.48,1.48,0,0,0,1.32-.55C162.55,96.25,162.55,95.37,162.55,94.38Zm1.1,0a4.21,4.21,0,0,1-.77,3.08,2.87,2.87,0,0,1-2,.66h-2.64V90.64h2.64a3.07,3.07,0,0,1,2,.66C163.76,92.18,163.65,93.28,163.65,94.38ZM149,95v3.08h-1.1V95l-2.2-4.4h1.21l1.54,3.3,1.54-3.3h1.21Zm-7.25-2.2a1.19,1.19,0,0,0-1.32-1.21h-1.65v2.31h1.65C141.34,94,141.78,93.61,141.78,92.84Zm.11,5.28-1.54-3.19h-1.43v3.19h-1.1V90.64h2.86a2.11,2.11,0,0,1,2.31,2.2,1.93,1.93,0,0,1-1.54,2l1.76,3.3Zm-12.53,0V90.64h4.84v1h-3.63v2.2h3.08v1h-3.08v2.31h3.63v1Zm-5.5,0H123l-2.42-7.47h1.21l1.76,5.5,1.76-5.5h1.21Zm-10.77,0V90.64h4.84v1H114.3v2.2h3.08v1H114.3v2.31h3.63v1Zm-9,0-3.52-5.28v5.28h-1.1V90.64h1L104,95.92V90.64h1.1v7.47Zm-9.67,0h1.1V90.64h-1.1ZM82,98.12V90.64h4.84v1H83.2v2.2h3.08v1H83.2v2.31h3.63v1Zm-8,0V90.64h1.1v6.48h3.63v1ZM69.13,96a1.07,1.07,0,0,0-1.21-1.1H66.16v2.31h1.76C68.69,97.13,69.13,96.69,69.13,96ZM69,92.73a1.07,1.07,0,0,0-1.21-1.1H66.16v2.2h1.65C68.58,93.83,69,93.5,69,92.73ZM70.23,96a2,2,0,0,1-2.31,2.09H64.84V90.64h3a2,2,0,0,1,2.31,2.09,1.65,1.65,0,0,1-1,1.54A2,2,0,0,1,70.23,96ZM59.9,98.12H61V90.64H59.9Zm-4.84-3.74c0-1,0-1.76-.44-2.2a1.82,1.82,0,0,0-1.32-.55H51.87v5.5H53.3a1.48,1.48,0,0,0,1.32-.55C55.06,96.25,55.06,95.37,55.06,94.38Zm1.1,0a4.21,4.21,0,0,1-.77,3.08,2.59,2.59,0,0,1-1.87.66H50.89V90.64h2.64a3.07,3.07,0,0,1,2,.66C56.27,92.18,56.16,93.28,56.16,94.38ZM42.53,98.12V90.64h4.84v1H43.74v2.2h3.08v1H43.74v2.31h3.63v1ZM37.7,92.84a1.19,1.19,0,0,0-1.32-1.21H34.73v2.31h1.65C37.26,94,37.7,93.61,37.7,92.84Zm.11,5.28-1.54-3.19H34.84v3.19h-1.1V90.64H36.6a2.11,2.11,0,0,1,2.31,2.2,1.93,1.93,0,0,1-1.54,2l1.76,3.3Zm-7.69-.77a2.81,2.81,0,0,1-2.09.88,3.16,3.16,0,0,1-2-.77c-.77-.77-.77-1.54-.77-3.08s0-2.31.77-3a2.92,2.92,0,0,1,4.07.11l-.77.77A1.57,1.57,0,0,0,28,91.63a1.68,1.68,0,0,0-1.1.44c-.33.44-.44.88-.44,2.31s.11,2,.44,2.31a1.27,1.27,0,0,0,1.1.44,1.44,1.44,0,0,0,1.32-.66Zm-9.56.77L17,92.84v5.28h-1.1V90.64h1l3.52,5.28V90.64h1.1v7.47Zm-9.67,0H12V90.64h-1.1Z"
                />
                <path
                  style={{ fill: '#e2001a' }}
                  d="M216.51,62.1c.33,0,.44-.11.44-.33a.4.4,0,0,0-.44-.44h-.66v.77Zm-.66,1.65a.4.4,0,0,1-.44.44c-.33,0-.33-.11-.33-.44V61.11c0-.22.11-.33.44-.33h1c.66,0,1.32.22,1.32,1s-.33.88-.88,1l.66,1V64c0,.22-.11.33-.44.33s-.33-.22-.44-.44l-.55-1H216v.88Zm.55,1A2.42,2.42,0,1,0,214,62.32,2.37,2.37,0,0,0,216.4,64.74Zm0-5.5a3.19,3.19,0,1,1-3.19,3.19A3.19,3.19,0,0,1,216.4,59.25Z"
                />
              </g>
            </g>
          </svg>
          <p style={styles.style1}>
            <span style={styles.style2}>T??RMINOS Y </span>
            <span style={styles.style2}>CONDICIONES GENERALES</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Alcance </span>
            <span style={styles.style2}>y vali</span>
            <span style={styles.style2}>dez</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>L</span>
            <span style={styles.style3}>o</span>
            <span style={styles.style3}>s presentes </span>
            <span style={styles.style3}>T??rminos y </span>
            <span style={styles.style3}>Condiciones Generales (en</span>
            <span style={styles.style2}>&#xa0;</span>
            <span style={styles.style3}>adelante,</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>los </span>
            <span style={styles.style2}>"T??rminos"</span>
            <span style={styles.style3}>
              ) tienen por objeto informarle sobre ciertas obligaciones legales
              entre{' '}
            </span>
            <span style={styles.style3}>[Indicar la raz??n social de</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>]</span>
            <span style={styles.style3}> (en </span>
            <span style={styles.style3}>lo subsecuente</span>
            <span style={styles.style3}>,</span>
            <span style={styles.style3}> </span>
            <span style={styles.style2}>"Royal </span>
            <span style={styles.style2}>Canin</span>
            <span style={styles.style2}>")</span>
            <span style={styles.style2}> </span>
            <span style={styles.style3}>
              y los consumidores y usuarios que utilizan el Internet de Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> o los sitios "web" (en adelante</span>
            <span style={styles.style3}> y en su conjunto</span>
            <span style={styles.style3}>, el</span>
            <span style={styles.style3}> </span>
            <span style={styles.style2}>"Sitio"</span>
            <span style={styles.style2}> </span>
            <span style={styles.style3}>o</span>
            <span style={styles.style3}> </span>
            <span style={styles.style2}>"Sitios"</span>
            <span style={styles.style3}>)</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Cualquier </span>
            <span style={styles.style3}>autorizaci??n</span>
            <span style={styles.style3}> de uso y disposici??n </span>
            <span style={styles.style3}>d</span>
            <span style={styles.style3}>el Sitio </span>
            <span style={styles.style3}>se encuentra</span>
            <span style={styles.style3}>n</span>
            <span style={styles.style3}> reservad</span>
            <span style={styles.style3}>o</span>
            <span style={styles.style3}>s</span>
            <span style={styles.style3}> por Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Los T??rminos establecen </span>
            <span style={styles.style3}>acuerdos</span>
            <span style={styles.style3}> legalmente vinculantes para </span>
            <span style={styles.style3}>el</span>
            <span style={styles.style3}>
              {' '}
              uso del Sitio y cualquiera de nuestros productos o servicios que
              usted{' '}
            </span>
            <span style={styles.style3}>utiliza o adquiere</span>
            <span style={styles.style3}> en el Sitio.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Al acceder y/o utilizar el Sitio, usted declara y garantiza que
              tiene el derecho y la autoridad de aceptar l
            </span>
            <span style={styles.style3}>as Condiciones</span>
            <span style={styles.style3}>
              {' '}
              y que acepta cumplir con todos los T??rminos.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Lea atentamente los T??rminos antes de utilizar el Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Es posible que se apliquen t??rminos adicionales para que ciertos
              productos y servicios del Sitio sean v??lidos (por ejemplo, si
              usted es miembro de nuestro programa de Suscripci??n, tambi??n
              estar?? sujeto a los T??rminos y Condiciones de Suscripci??n).
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              se reserva el derecho de cambiar cualquier condici??n e informaci??n
              disponible en las extensiones del Sitio, incluidos los T??rminos,
              sin{' '}
            </span>
            <span style={styles.style3}>necesidad de </span>
            <span style={styles.style3}>previo aviso.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Dichos cambios surtir??n efecto en el momento de su publicaci??n en
              el Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>El</span>
            <span style={styles.style3}> uso del Sitio </span>
            <span style={styles.style3}>se encuentra</span>
            <span style={styles.style3}> sujeto a </span>
            <span style={styles.style3}>la</span>
            <span style={styles.style3}> aceptaci??n de estos T??rminos</span>
            <span style={styles.style3}>. </span>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>revisa</span>
            <span style={styles.style3}>
              {' '}
              constantemente la exactitud y actualizaci??n de la informaci??n
              disponible en el Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Sin embargo, a pesar de toda diligencia debida, la informaci??n
              disponible en el Sitio puede no estar actualizada en comparaci??n
              con los cambios reales.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Los productos e informaci??n que encontrar?? en el Sitio se
              presentan de tal manera que ser??n v??lidos en el momento de su
              publicaci??n en el Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Por esta raz??n, puede haber diferencias entre la situaci??n actual
              del servicio respectivo y su situaci??n en el Sitio.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>
              Derecho a realizar cambios en el Sitio
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> se reserva el derecho de </span>
            <span style={styles.style3}>realizar cambios en</span>
            <span style={styles.style3}>
              {' '}
              todos y cada uno de los servicios, productos y t??rminos de uso
              disponibles en el Sitio y las extensiones del Sitio, incluidos{' '}
            </span>
            <span style={styles.style3}>los presentes</span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>T??rminos </span>
            <span style={styles.style3}>y </span>
            <span style={styles.style3}>Condiciones</span>
            <span style={styles.style3}>
              , as?? como cualquier informaci??n proporcionada en el Sitio,
              reorganizar el Sitio y suspender su publicaci??n, sin{' '}
            </span>
            <span style={styles.style3}>necesidad de </span>
            <span style={styles.style3}>previo aviso.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Dichos cambios surtir??n efecto en el momento de su publicaci??n en
              el Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              El uso del Sitio o el acceso al Sitio constituye la aceptaci??n de
              estos cambios.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              no asume ninguna responsabilidad por cualquier interrupci??n,
              fallo, negligencia,{' '}
            </span>
            <span style={styles.style3}>corte</span>
            <span style={styles.style3}>
              , eliminaci??n, p??rdida, retraso en la transacci??n o
            </span>
            <span style={styles.style3}>
              comunicaci??n, virus inform??ticos, error de comunicaci??n, robo,
              destrucci??n o acceso no autorizado a los registros, alteraci??n o
              uso de{' '}
            </span>
            <span style={styles.style3}>los mismos</span>
            <span style={styles.style3}>
              {' '}
              como consecuencia de cualquier incumplimiento de los T??rminos,
              agravio, negligencia o cualquier otra raz??n
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style4}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>
              Restricciones a la informaci??n, art??culos y recomendaciones
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              puede ofrecer informaci??n, art??culos y recomendaciones con
              respecto a las mascotas, solo con fines educativos, en el Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Cualquier informaci??n, art??culo o recomendaci??n presentada a
              trav??s de este Sitio no est?? destinada a diagnosticar o tratar
              ninguna enfermedad de su mascota y no sustituir?? los servicios
              veterinarios proporcionados por un veterinario.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              P??ngase en contacto con su veterinario para obtener consejos
              m??dicos o de salud sobre el cuidado y tratamiento de su mascota
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
            <span style={styles.style2}>P</span>
            <span style={styles.style2}>resentaci??n</span>
            <span style={styles.style2}> de producto</span>
            <span style={styles.style2}>s</span>
            <span style={styles.style2}> y colores</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Este Sitio se esfuerza por mostrar im??genes de productos de la
              manera m??s realista posible.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Sin embargo, no podemos garantizar que el color que ve en el Sitio
              coincida con el color real del producto.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Recuerde que la p</span>
            <span style={styles.style3}>resentaci??n del</span>
            <span style={styles.style3}>
              {' '}
              color puede depender parcialmente de la pantalla (monitor) y{' '}
            </span>
            <span style={styles.style3}>de </span>
            <span style={styles.style3}>
              la configuraci??n de su dispositivo
            </span>
            <span style={styles.style3}> y,</span>
            <span style={styles.style3}>
              {' '}
              por lo tanto, los colores pueden diferir.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>
              Errores que pueden ocurrir en el Sitio
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Los precios y la disponibilidad de los productos y servicios
              ofrecidos en el Sitio pueden ser modificados sin previo aviso a
              los usuarios.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>En caso de</span>
            <span style={styles.style3}>
              {' '}
              alg??n error en la informaci??n proporcionada en el Sitio, dichos
              errores ser??n corregidos por Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              se reserva el derecho de cancelar cualquier oferta, y de corregir
              cualquier error, omisi??n o negligencia, incluyendo su tarjeta de
              cr??dito / d??bito, e informaci??n sobre si el pedido ha sido
              confirmado o no.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si su tarjeta de cr??dito / d??bito ya ha sido cargada por la compra
              y su pedido ha sido cancelado, el importe correspondiente ser??
              reembolsado a su tarjeta de cr??dito / d??bito.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              El per??odo de tiempo en el que el reembolso de dicha cantidad se
              reflejar?? en su tarjeta de cr??dito / d??bito puede variar de
              acuerdo con las pr??cticas de su banco, Royal C
            </span>
            <span style={styles.style3}>anin</span>
            <span style={styles.style3}>
              {' '}
              no se hace responsable en este sentido.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si no est?? satisfecho con un producto que ha comprado, puede
              devolverlo de acuerdo con las condiciones de devoluci??n prescritas
              en estos T??rminos.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Derechos de propiedad intelectual</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              El Sitio incluye valiosas marcas comerciales y marcas de servicio
            </span>
            <span style={styles.style3}> </span>
            <span style={styles.style2}>("Marcas </span>
            <span style={styles.style2}>Royal </span>
            <span style={styles.style2}>Canin</span>
            <span style={styles.style2}>")</span>
            <span style={styles.style2}> </span>
            <span style={styles.style3}>propiedad </span>
            <span style={styles.style3}>de </span>
            <span style={styles.style3}>y utilizadas por Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              , incluyendo, pero no limitado a, los logotipos de Royal
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              y el logotipo de la tienda virtual Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Los programas para la preservaci??n de informaci??n, textos,
              im??genes, marcas comerciales, esl??ganes y otros signos, y la
              informaci??n relacionada con otros derechos de propiedad
              intelectual disponibles en el Sitio, as?? como el dise??o de la
              p??gina y la presentaci??n del Sitio son exclusivamente propiedad de
              Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Sin el consentimiento previo </span>
            <span style={styles.style3}>y </span>
            <span style={styles.style3}>por escrito de Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>, est?? </span>
            <span style={styles.style3}>estrictamente </span>
            <span style={styles.style3}>
              prohibido copiar, modificar, publicar, en parte o en su totalidad,
              cualquier informaci??n, im??genes o descripciones disponibles en el
              Sitio o cualquier base de datos, sitios web, c??digos de software
              con respecto a esta p??gina, y enviar, distribuir o vender l
            </span>
            <span style={styles.style3}>os</span>
            <span style={styles.style3}> mism</span>
            <span style={styles.style3}>os</span>
            <span style={styles.style3}>
              {' '}
              mediante el uso de cualquier medio en l??nea u otros medios.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              La copia parcial o la impresi??n de la informaci??n disponible en el
              Sitio solo es posible para sus necesidades personales{' '}
            </span>
            <span style={styles.style3}>y </span>
            <span style={styles.style3}>no comerciales.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Uso permitido del Sitio</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Sujeto a </span>
            <span style={styles.style3}>los presentes</span>
            <span style={styles.style3}> T??rminos y Condiciones, Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              otorga un derecho intransferible y no exclusivo para acceder al
              Sitio,{' '}
            </span>
            <span style={styles.style3}>el cual</span>
            <span style={styles.style3}> se limita a su uso personal.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Este derecho no incluye el derecho de acceder o utilizar el Sitio
              para cualquier reventa o uso comercial de{' '}
            </span>
            <span style={styles.style3}>su </span>
            <span style={styles.style3}>contenidos </span>
            <span style={styles.style3}>o propiedades </span>
            <span style={styles.style3}>
              del Sitio, o para cualquiera de lo
            </span>
            <span style={styles.style3}>s </span>
            <span style={styles.style3}>prop??sitos limitados</span>
            <span style={styles.style3}> se??alados a continuaci??n</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              puede revocar este derecho en cualquier momento sin
            </span>
            <span style={styles.style3}>necesidad de </span>
            <span style={styles.style3}>justificaci??n</span>
            <span style={styles.style3}> alguna</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Los derechos que se otorgan en virtud de est
            </span>
            <span style={styles.style3}>os T??rminos y</span>
            <span style={styles.style3}> Condiciones </span>
            <span style={styles.style3}>se encuentran</span>
            <span style={styles.style3}>
              {' '}
              sujetos a las siguientes condiciones: (a) No puede utilizar el
              Sitio para la reventa de productos o servicios a terceros en
              nombre suyo o de terceros;
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>(b) </span>
            <span style={styles.style3}>N</span>
            <span style={styles.style3}>
              o puede licenciar, sublicenciar, reproducir, vender, alquilar,
              transferir, distribuir, alojar o utilizar comercialmente el Sitio,
              sus productos o contenidos sin el
            </span>
            <span style={styles.style3}>autorizaci??n</span>
            <span style={styles.style3}> previ</span>
            <span style={styles.style3}>a y</span>
            <span style={styles.style3}> por escrito de Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>;</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>(c) </span>
            <span style={styles.style3}>N</span>
            <span style={styles.style3}>
              o puede modificar, desensamblar o compilar ninguna parte del
              Sitio, y no puede hacer ninguna{' '}
            </span>
            <span style={styles.style3}>trabajo u</span>
            <span style={styles.style3}>obra derivada en el mismo;</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              (d) Usted no puede acceder al Sitio para crear un servicio similar
              o{' '}
            </span>
            <span style={styles.style3}>que nos genere competencia</span>
            <span style={styles.style3}>
              o para descargar, copiar o agregar contenido o informaci??n de{' '}
            </span>
            <span style={styles.style3}>la </span>
            <span style={styles.style3}>
              cuenta para otra persona o empresa;
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              (e) Usted no puede copiar, reproducir, distribuir, volver a
              publicar, descargar, mostrar o transmitir ninguna parte del Sitio
              sin el permiso expl??cito por escrito de Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              , a menos que se especifique expresamente en este documento
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              se reserva el derecho de modificar, suspender
            </span>
            <span style={styles.style3}>, descontinuar</span>
            <span style={styles.style3}>
              {' '}
              o interrumpir el Sitio o cualquier parte{' '}
            </span>
            <span style={styles.style3}>del mismo</span>
            <span style={styles.style3}>
              , en cualquier momento, sin previo aviso.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Usted acepta que Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>
              no ser?? responsable ante usted o cualquier tercero por la
              modificaci??n, suspensi??n o interrupci??n del Sitio o de cualquier
              parte{' '}
            </span>
            <span style={styles.style3}>del mismo</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Cuenta de usuario</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Debe inscribirse en el Sitio y proporcionar la informaci??n
              espec??fica indicada en el formulario de registro del Sitio para
              poder utilizar ciertas propiedades del Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>En este formulario de</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>registro, usted se </span>
            <span style={styles.style3}>obliga</span>
            <span style={styles.style3}>
              {' '}
              y declara que: (a) toda la informaci??n de registro necesaria
              enviada por usted ser??{' '}
            </span>
            <span style={styles.style3}>verdadera,</span>
            <span style={styles.style3}>confiable</span>
            <span style={styles.style3}>, </span>
            <span style={styles.style3}>
              precisa y seguir?? siendo precisa, y (b){' '}
            </span>
            <span style={styles.style3}>el</span>
            <span style={styles.style3}>
              {' '}
              uso del Sitio no viola ninguna disposici??n{' '}
            </span>
            <span style={styles.style3}>legal</span>
            <span style={styles.style3}> aplicable o de los T??rminos.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Usted es responsable de mantener la confidencialidad de su
              informaci??n de inicio de sesi??n de Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Usted es responsable de todas las actividades asociadas con su
              cuenta de Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              (incluyendo, pero no limitado a, cualquier compra, uso del Sitio o
              correspondencia en su cuenta de Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>).</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              En caso de cualquier uso no autorizado del Sitio o de su cuenta de
              usuario en el Sitio, debe notificar inmediatamente a Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> a este respecto.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              En el caso de una notificaci??n de este tipo a Royal
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>, Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> p</span>
            <span style={styles.style3}>odr??</span>
            <span style={styles.style3}>
              {' '}
              suspender o proteger su cuenta para evitar el uso no autorizado de
              su cuenta
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Contenido del </span>
            <span style={styles.style2}>U</span>
            <span style={styles.style2}>suario</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>"Contenido</span>
            <span style={styles.style3}> </span>
            <span style={styles.style2}>del </span>
            <span style={styles.style2}>U</span>
            <span style={styles.style2}>suario"</span>
            <span style={styles.style2}> </span>
            <span style={styles.style3}>
              se refiere a cualquier informaci??n y contenido enviado por el
              Usuario del Sitio a Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Usted es el ??nico responsable del Contenido de
            </span>
            <span style={styles.style3}>U</span>
            <span style={styles.style3}>suario.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Usted asume todos los riesgos asociados con el uso del Contenido
              de Usuario, y la exactitud e integridad del contenido relevante.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Usted declara y garantiza que tiene los derechos
            </span>
            <span style={styles.style3}>y/</span>
            <span style={styles.style3}>o autorizaciones necesari</span>
            <span style={styles.style3}>a</span>
            <span style={styles.style3}>s para utilizar el Contenido de </span>
            <span style={styles.style3}>U</span>
            <span style={styles.style3}>suario en el Sitio.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Dado que usted es el ??nico responsable del Contenido de
            </span>
            <span style={styles.style3}>U</span>
            <span style={styles.style3}>
              suario, tambi??n ser?? el ??nico responsable en caso de que
            </span>
            <span style={styles.style3}>se </span>
            <span style={styles.style3}>infrinjan requisitos leg</span>
            <span style={styles.style3}>ales</span>
            <span style={styles.style3}> y </span>
            <span style={styles.style3}>los presentes</span>
            <span style={styles.style3}> T??rminos.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              no est?? obligado a respaldar ning??n Contenido de Usuario y no hace
              ninguna declaraci??n de que lo har??.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Usted acepta que Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              puede eliminar el Contenido de Usuario en cualquier momento.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              tratar?? cualquier comentario, comunicaci??n o sugerencia que
              proporcione a Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> como confidencial.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Por lo tanto, usted acepta que, en ausencia de un acuerdo escrito{' '}
            </span>
            <span style={styles.style3}>o </span>
            <span style={styles.style3}>
              celebrado de otra manera con Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              , no enviar?? ninguna informaci??n u opini??n a Royal
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              que usted crea confidencial o propiedad de terceros
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Pol??tica de uso</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Usted acepta </span>
            <span style={styles.style3}>NO</span>
            <span style={styles.style3}>
              {' '}
              utilizar el Sitio para recopilar, descargar, transmitir, mostrar o
              distribuir cualquier Contenido de Usuario que (a) viole los
              derechos de propiedad intelectual y confidencialidad de terceros;
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              (b) sea ilegal, injustificado, amenazante, da??ino, infrinja la
              privacidad de otros, vulgar, difamatorio, incluya una declaraci??n
              falsa,
            </span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>deliberadamente</span>
            <span style={styles.style3}> enga??osa</span>
            <span style={styles.style3}>, comercia</span>
            <span style={styles.style3}>ble</span>
            <span style={styles.style3}>
              , pornogr??fica y expl??citamente agresiva (por ejemplo, contenidos
              que sean{' '}
            </span>
            <span style={styles.style3}>de cualquier forma</span>
            <span style={styles.style3}>segregadores, perjudiciales o </span>
            <span style={styles.style3}>da??inos</span>
            <span style={styles.style3}>
              {' '}
              para cualquier grupo, individuo o ni??os);
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              o (c) viole las leyes aplicables, cualquier obligaci??n contractual
              o{' '}
            </span>
            <span style={styles.style3}>los presentes</span>
            <span style={styles.style3}> T??rminos</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Ad</span>
            <span style={styles.style3}>icionalmente</span>
            <span style={styles.style3}>, usted acepta </span>
            <span style={styles.style3}>NO</span>
            <span style={styles.style3}>
              {' '}
              utilizar el Sitio para fines comerciales o{' '}
            </span>
            <span style={styles.style3}>para </span>
            <span style={styles.style3}>
              los siguientes prop??sitos: (a) instalar, transmitir o distribuir
              cualquier virus o software que infecte los sistemas inform??ticos;
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>(b) env</span>
            <span style={styles.style3}>iar</span>
            <span style={styles.style3}>
              {' '}
              publicidad no deseada o no autorizada, materiales promocionales,
              correos electr??nicos no deseados{' '}
            </span>
            <span style={styles.style3}>o basura</span>
            <span style={styles.style3}>
              , o cualquier otro mensaje espurio, con fines comerciales o de
              otro tipo;
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              (c) recopilar informaci??n sobre otros usuarios, incluidas las
              direcciones de correo electr??nico sin su consentimiento;
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              (d) bloquear o interrumpir los servidores o redes conectados al
              Sitio o violar los a
            </span>
            <span style={styles.style3}>cuerdos</span>
            <span style={styles.style3}>
              , pol??ticas o procedimientos de dichas redes;
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              (e) intentar obtener acceso no autorizado a las redes conectadas o
              utilizadas con otros sistemas inform??ticos o el servidor;
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              o (f) intervenir o impedir que otros usuarios utilicen el Sitio de
              cualquier manera.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              En el caso de que usted viole cualquier disposici??n de estos
              T??rminos y Condiciones, cualquier Contenido de Usuario puede ser
              revisado, investigado y/o las precauciones apropiadas pueden ser
              tomadas,{' '}
            </span>
            <span style={styles.style3}>incluyendo,</span>
            <span style={styles.style3}> pero no limitado a</span>
            <span style={styles.style3}>,</span>
            <span style={styles.style3}>
              {' '}
              la eliminaci??n, modificaci??n, terminaci??n de la cuenta de usuario
              y / o{' '}
            </span>
            <span style={styles.style3}>presentar</span>
            <span style={styles.style3}> cualquier aviso y queja a</span>
            <span style={styles.style3}>nte</span>
            <span style={styles.style3}>
              {' '}
              las autoridades legales, a la sola discreci??n de Royal
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> (sin </span>
            <span style={styles.style3}>que</span>
            <span style={styles.style3}> Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>tenga la</span>
            <span style={styles.style3}>
              {' '}
              obligaci??n de hacerlo de ninguna manera).
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Podemos eliminar o modificar los Contenidos del Usuario en
              cualquier caso en que dichos Contenidos de Usuario puedan causar
              una violaci??n de derechos o{' '}
            </span>
            <span style={styles.style3}>generar</span>
            <span style={styles.style3}>
              {' '}
              una responsabilidad contra Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              En el caso de que tengamos alguna obligaci??n de acuerdo con la
              legislaci??n, la informaci??n necesaria, incluyendo su nombre de
              usuario y contrase??a, su direcci??n IP
            </span>
            <span style={styles.style3}>,</span>
            <span style={styles.style3}> e</span>
            <span style={styles.style3}>l</span>
            <span style={styles.style3}> tr??fico</span>
            <span style={styles.style3}> de la informaci??n</span>
            <span style={styles.style3}>
              {' '}
              y sus Contenidos de Usuario, podr??n ser compartidas con las
              autoridades pertinentes de acuerdo con las solicitudes de las
              autoridades oficiales, administrativas o judiciales
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Para evitar dudas, el Usuario es responsable de los Contenidos de
              Usuario comunicados al Sitio, y Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              tendr?? derecho a controlarlos, modificarlos o eliminarlos del
              Sitio, pero no tendr?? ninguna obligaci??n en este sentido.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              En caso de que los Contenidos del Usuario infrinjan cualquier
              disposici??n legal, estos T??rminos o cualquier obligaci??n
              contractual, el usuario correspondiente ser?? personalmente
              responsable de dicha violaci??n, y Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              no tiene ninguna responsabilidad al respecto.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Su interacci??n con otros usuarios del Sitio es solo entre usted y
              el usuario relacionado.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Usted acepta que Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              no ser?? responsable de ninguna disputa, p??rdida o da??o que surja
              de dichas interacciones
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Programa de </span>
            <span style={styles.style2}>Suscripci??n</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Al marcar la opci??n "Suscripci??n" en la p??gina de pago del sitio
              web de Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>, se considera que ha aceptado </span>
            <span style={styles.style3}>los </span>
            <span style={styles.style5}>T??rminos y Condiciones de</span>
            <span style={styles.style5}>&#xa0;</span>
            <span style={styles.style5}>Suscripci??n (</span>
            <span style={styles.style6}>"T??rminos de Suscripci??n")</span>
            <span style={styles.style5}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Los T??rminos de Suscripci??n tambi??n rigen{' '}
            </span>
            <span style={styles.style3}>lo</span>
            <span style={styles.style3}>
              s t??rminos de membres??a autom??tica, adem??s de todos los t??rminos,
              condiciones, limitaciones y requisitos (
            </span>
            <span style={styles.style3}>los cuales</span>
            <span style={styles.style3}> pueden ser modificados de </span>
            <span style={styles.style3}>tiempo en tiempo)</span>
            <span style={styles.style3}> aplicables al Sitio, as?? como </span>
            <span style={styles.style3}>los presentes</span>
            <span style={styles.style3}>
              {' '}
              T??rminos que regulan el uso del Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Al registrarse en nuestro programa de Suscripci??n se considerar??
              que ha aceptado los T??rminos de Suscripci??n.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Lea atentamente estos T??rminos de{' '}
            </span>
            <span style={styles.style3}>S</span>
            <span style={styles.style3}>uscripci??n</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Sitios de </span>
            <span style={styles.style2}>Terceros </span>
            <span style={styles.style2}>y otros usuarios</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              El Sitio puede contener enlaces o anuncios de sitios web de
              terceros (colectivamente,
            </span>
            <span style={styles.style3}> </span>
            <span style={styles.style2}>"Sitios</span>
            <span style={styles.style2}> </span>
            <span style={styles.style2}>de Terceros</span>
            <span style={styles.style3}>
              ") (es decir, sitios de redes sociales como Facebook, YouTube,
              Twitter o Pinterest).
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              no es responsable de ning??n Sitio de Terceros.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              proporciona enlaces a estos Sitios de Terceros solo por
              conveniencia y no hace ninguna declaraci??n o compromiso con
              respecto a los Sitios de Terceros, no confirma, verifica ni
              garantiza su contenido.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Usted acepta que utiliza todos los Sitios de Terceros bajo su
              propio riesgo.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Cuando se conecta a un Sitio de Terceros, se aplicar??n los
              t??rminos de uso del Sitio de Terceros correspondiente, incluidas
              las pr??cticas de privacidad y recopilaci??n de datos.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Antes de comenzar a usar cualquier Sitio de Terceros, antes de
              realizar cualquier transacci??n en ellos o continuar l
            </span>
            <span style={styles.style3}>a</span>
            <span style={styles.style3}> mism</span>
            <span style={styles.style3}>a</span>
            <span style={styles.style3}>
              , debe revisar dichos Sitios de Terceros seg??n sea necesario o
              apropiado.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Requisito de </span>
            <span style={styles.style2}>E</span>
            <span style={styles.style2}>valuaci??n de </span>
            <span style={styles.style2}>P</span>
            <span style={styles.style2}>edidos</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Verificaremos su m??todo de pago y / o direcci??n de env??o cuando
              realice un pedido a trav??s del Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              se reserva el derecho de rechazar cualquier pedido sin dar ninguna
              raz??n o cambiar la cantidad del producto a suministrar.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si su pedido es rechazado, se le informar?? a trav??s de su
              direcci??n de correo electr??nico proporcionad
            </span>
            <span style={styles.style3}>a</span>
            <span style={styles.style3}> en su pedido.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si ya se le ha cobrado por un pedido rechazado, la tarifa se le
              reembolsar?? con el m??todo de pago que haya utilizado{' '}
            </span>
            <span style={styles.style3}>a</span>
            <span style={styles.style3}>l momento de realizar el pedido</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>
              Aceptaci??n y confirmaci??n del pedido
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Cuando realice un pedido a trav??s del Sitio, se le informar?? a
              trav??s de su direcci??n de correo electr??nico que su pedido ha sido
              recibido.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              se reserva el derecho de limitar la cantidad de cualquier pedido
              realizado para cualquier producto sin previo aviso.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              En algunos casos, puede ser necesario verificar su informaci??n
              antes de confirmar su pedido a trav??s del Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Los precios y la informaci??n de stock de los productos en el Sitio
              pueden ser modificados unilateralmente por Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> sin previo aviso.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              En caso de cualquier error encontrado en el Sitio o con respecto
              al pedido, dichos errores pueden ser corregidos por Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Limitaciones de </span>
            <span style={styles.style2}>P</span>
            <span style={styles.style2}>edido y </span>
            <span style={styles.style2}>C</span>
            <span style={styles.style2}>antidad</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              puede limitar o cancelar los montos comprados por persona, por
              hogar o por pedido, a su entera discreci??n y sin ning??n requisito{' '}
            </span>
            <span style={styles.style3}>de</span>
            <span style={styles.style3}> previo aviso.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Dichas limitaciones pueden aplicarse a los pedidos realizados por
              la misma cuenta del Sitio, a trav??s de la misma tarjeta de cr??dito
              / d??bito, o los pedidos utilizando la misma direcci??n de
              facturaci??n y / o env??o.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si realizamos un cambio en su pedido, le informaremos a trav??s de
              su direcci??n de correo electr??nico proporcionada con su pedido.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              se reserva el derecho de limitar o prohibir las ventas a clientes
              corporativos a trav??s del Sitio
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Condiciones de entrega</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Su pedido ser?? entregado a la compa????a de carga a m??s tardar
              dentro de tres (3) d??as h??biles (de lunes a viernes) despu??s de
              que se reciba la confirmaci??n de su pago.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Sus pedidos solo se entregar??n a direcciones dentro de los l??mites
              de la Rep??blica{' '}
            </span>
            <span style={styles.style3}>Mexicana</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Dependiendo de la distancia de la direcci??n de entrega al centro
              log??stico donde se encuentran los productos Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              , la compa????a de carga le transmitir?? su pedido en un plazo de 1-5
              d??as.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si hay alg??n inconveniente causado por nosotros, le informaremos a
              trav??s de la informaci??n de contacto que nos ha proporcionado.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Por esta raz??n, es importante que su informaci??n de contacto se
              proporcione de forma completa y precisa.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Los productos que haya adquirido se notificar??n mediante un correo
              electr??nico de confirmaci??n.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Si alguno de </span>
            <span style={styles.style3}>lo</span>
            <span style={styles.style3}>
              s productos seleccionados no est?? disponible en stock, se le
              enviar?? un correo electr??nico y se le notificar?? la fecha en que
              el producto se colocar?? por primera vez en las existencias.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              El Sitio es un sitio de comercio electr??nico y permite a varios
              usuarios comprar al mismo tiempo.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Puede ser el caso de que m??s de un consumidor compre el mismo
              producto y, por lo tanto, se agote el stock de productos.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              En tal caso, si el producto que ha pagado est?? fuera de nuestras
              existencias, se comprobar?? si las existencias de productos se{' '}
            </span>
            <span style={styles.style3}>
              sustituyen en un plazo de 1-5 d??as.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si se hace definitivo que las existencias del producto no ser??n
              reemplazadas dentro de este plazo, entonces su pago efectuado para
              el producto en cuesti??n se le reembolsar?? con el m??todo de pago
              que haya utilizado en el momento de realizar el pedido.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Todos los productos comprados a Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              se entregar??n a los usuarios a trav??s de una empresa de carga.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Una vez entregados los productos por la empresa de carga al
              usuario, todo tipo de da??os y riesgos relacionados con los
              productos se transmitir??n al usuario
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Precio y Pago</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Puede realizar los pagos</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>de sus pedidos con</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>tarjeta de d??bito o cr??dito.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Aceptamos Tarjeta Visa??, MasterCard??, American Express?? y
            </span>
            <span style={styles.style3}>Discover</span>
            <span style={styles.style3}>?? </span>
            <span style={styles.style3}>Car </span>
            <span style={styles.style3}>
              y MasterCard o tarjetas bancarias con el logotipo de Visa para las
              compras a trav??s del Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>El pago se efectuar?? en</span>
            <span style={styles.style3}> pesos mexicanos</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Todos los precios mostrados en el Sitio incluir??n el 1
            </span>
            <span style={styles.style3}>6</span>
            <span style={styles.style3}>
              % de IVA aplicable en la Rep??blica{' '}
            </span>
            <span style={styles.style3}>
              Mexicana o el impuesto correspondiente para algunos Estados
              fronterizos
            </span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Con el fin de ofrecer un sistema de pago seguro, Royal
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              utiliza los sistemas de pago seguros de las principales
              instituciones financieras.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>En general, Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}> no </span>
            <span style={styles.style3}>realiza el cargo a</span>
            <span style={styles.style3}> tarjetas de cr??dito</span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>/</span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>
              d??bito hasta que la empresa env??e su pedido o confirme su
              disponibilidad (durante este tiempo, solo se le cobrar?? por los
              productos que hemos enviado junto con los impuestos o cargos de
              flete aplicables).
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Sin embargo, podemos recibir una </span>
            <span style={styles.style3}>pre</span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>autorizaci??n</span>
            <span style={styles.style3}> para el pago de su pedido</span>
            <span style={styles.style3}>,</span>
            <span style={styles.style3}>
              {' '}
              del emisor de su tarjeta de cr??dito / d??bito en la fecha en que se
              realiza su pedido.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Esto puede afectar su cr??dito actual
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Promociones y Cupones</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Si se utiliza un c??digo de promoci??n /
            </span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>
              cup??n, el c??digo determinado para la oferta correspondiente debe
              introducirse en el campo "C??digo de promoci??n" al momento de la
              compra.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Los c??digos de promoci??n o cupones no se pueden combinar con otras
              promociones o cupones;
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              s??lo se puede utilizar un c??digo de promoci??n o cup??n por una sola
              transacci??n y el importe de dicha promoci??n o cup??n se descontar??
              del saldo de
            </span>
            <span style={styles.style3}>l carrito </span>
            <span style={styles.style3}>de compra.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              se reserva el derecho de restringir el pago de ciertos productos,
              pesos, ciertas tarifas de env??o y tarifas de env??o aceleradas por
              medio de c??digos de promoci??n o cupones.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              A menos que se indique lo contrario en los t??rminos de la oferta,
              los cupones en l??nea no ser??n v??lidos en las tiendas Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              ni en ning??n punto de venta donde se vendan los productos de Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Condiciones y </span>
            <span style={styles.style2}>P</span>
            <span style={styles.style2}>rocedimientos de </span>
            <span style={styles.style2}>D</span>
            <span style={styles.style2}>evoluci??n</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Usted puede devolver el producto comprado a trav??s del Sitio en un
              plazo de 14 (catorce) d??as a partir de la fecha de recepci??n, en
              su forma original, sin usar ni da??ar el producto, y sin poner en
              peligro su comerciabilidad o uso.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si presenta su reclamaci??n de reembolso acompa??ada del producto,
              la factura del producto y la causa de la devoluci??n, se aplicar??
              el procedimiento de devoluci??n.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              No aceptaremos la devoluci??n de productos desempaquetados
            </span>
            <span style={styles.style3}>,</span>
            <span style={styles.style3}> probados</span>
            <span style={styles.style3}>, </span>
            <span style={styles.style3}>da??ados </span>
            <span style={styles.style3}>o</span>
            <span style={styles.style3}> usados</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              En caso de que la factura del producto que desea devolver se haya
              realizado a nombre de una empresa, debe enviar el producto
              acompa??ado de una factura de devoluci??n elaborada por la empresa
              correspondiente.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              La factura de devoluci??n debe realizarse sin incluir la tarifa de
              env??o (precio unitario del producto + IVA).
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Las devoluciones de los pedidos, de los cuales las facturas se
              realizan en nombre de{' '}
            </span>
            <span style={styles.style3}>personas morales o</span>
            <span style={styles.style3}>
              {' '}
              jur??dicas, no se completar??n a menos que se{' '}
            </span>
            <span style={styles.style3}>expida</span>
            <span style={styles.style3}> una factura de devoluci??n</span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              Por favor, desempaquete y compruebe los paquetes que ha recibido
              en presencia del funcionario de la empresa de mensajer??a.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si hay alg??n da??o en el producto, no
            </span>
            <span style={styles.style3}> reciba </span>
            <span style={styles.style3}>el producto, y </span>
            <span style={styles.style3}>solicite</span>
            <span style={styles.style3}>
              {' '}
              que la empresa de mensajer??a prepare un informe por escrito.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Con la recepci??n del producto, usted acepta que la empresa de
              mensajer??a ha cumplido completamente con su deber y que ha
              recibido el producto en un estado intacto y completo
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>No se aceptar?? la</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              devoluci??n de los productos que haya comprado a trav??s del Sitio,
              y que{' '}
            </span>
            <span style={styles.style3}>se encuentren</span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>desempacados</span>
            <span style={styles.style3}>
              , da??ados, con paquetes da??ados, mal funcionamiento, rotos,
              destruidos, desgarrados y/o utilizados.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              No aceptamos la devoluci??n de ning??n producto{' '}
            </span>
            <span style={styles.style3}>cuyo empaque </span>
            <span style={styles.style3}>
              original ha sido da??ado, destruido, etc.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Usted est?? obligado a devolver el producto en las mismas
              condiciones que en el momento en que lo recibi
            </span>
            <span style={styles.style3}>??</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Si devuelve su producto, o si ejerce su derecho de desistimiento
              antes de recibir el producto, el precio del producto ser??
              reembolsado en su cuenta en
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>un plazo de </span>
            <span style={styles.style5}>tres</span>
            <span style={styles.style5}>&#xa0;</span>
            <span style={styles.style5}>(3) d??as</span>
            <span style={styles.style5}>&#xa0;</span>
            <span style={styles.style5}>h??biles</span>
            <span style={styles.style3}>
              {' '}
              a partir de la fecha de recepci??n del producto en nuestra
              direcci??n de devoluci??n del producto a trav??s del m??todo de
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              pago que haya utilizado en el momento de realizar el pedido.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              El per??odo de tiempo en el que el reembolso de dicha cantidad se
              reflejar?? en su tarjeta de cr??dito / d??bito puede variar
              dependiendo de las pr??cticas de su banco, y Royal{' '}
            </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              no se hace responsable en este sentido.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              El reembolso de los montos de ventas a pagar a plazos puede ser
              reflejado por su banco a su tarjeta de cr??dito / d??bito cada mes
              como un art??culo de cr??dito
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Limitaci??n de responsabilidad</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              no ser?? responsable de ning??n da??o directo o indirecto que pueda
              surgir de cualquier violaci??n de los T??rminos, agravio o cualquier
              otra raz??n debido al acceso al Sitio, el uso del Sitio o cualquier
              otro dato o programa en el Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              no asume ninguna responsabilidad por cualquier interrupci??n de las
              transacciones realizadas a trav??s del Sitio, cualquier falla o
              negligencia que pueda surgir como consecuencia del incumplimiento
              de los T??rminos, agravio, negligencia o cualquier otra raz??n.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              no ser?? responsable de ning??n da??o, incluidos los costos de
              litigio y cualquier otro gasto,{' '}
            </span>
            <span style={styles.style3}>ni</span>
            <span style={styles.style3}>
              {' '}
              de cualquier responsabilidad incurrida como resultado del acceso o
              uso del Sitio o de los Sitios de Terceros vinculados.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Jurisdicci??n </span>
            <span style={styles.style2}>y Leyes </span>
            <span style={styles.style2}>Aplicables</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>
              En caso de cualquier disputa que pueda surgir de estos T??rminos y
              el uso del Sitio, principalmente, las disposiciones de estas
              Condiciones ser??n aplicables, y si estos T??rminos no contienen
              ninguna disposici??n pertinente, la legislaci
            </span>
            <span style={styles.style3}>??</span>
            <span style={styles.style3}>n de l</span>
            <span style={styles.style3}>os Estados Unidos Mexicanos</span>
            <span style={styles.style3}> ser?? aplicable.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Cualquier disputa que surja de o en relaci??n con estos T??rminos y
              el uso del Sitio ser?? resuelta por los Tribunales{' '}
            </span>
            <span style={styles.style3}>
              competentes en la Ciudad de M??xico, M??xico.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Confidencialidad</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>En tanto los presentes</span>
            <span style={styles.style3}> T??rminos </span>
            <span style={styles.style3}>se encuentren</span>
            <span style={styles.style3}> en vigor </span>
            <span style={styles.style3}>e incluso</span>
            <span style={styles.style3}>
              {' '}
              despu??s de la terminaci??n de los mismos, las Partes no divulgar??n
              ninguna informaci??n o documentos que se les comuniquen por
              escrito, verbalmente o{' '}
            </span>
            <span style={styles.style3}>a trav??s de</span>
            <span style={styles.style3}> </span>
            <span style={styles.style3}>cualquier </span>
            <span style={styles.style3}>otro m</span>
            <span style={styles.style3}>edio </span>
            <span style={styles.style2}>("Informaci??n Confidencial")</span>
            <span style={styles.style2}> </span>
            <span style={styles.style3}>
              a terceros, y no utilizar??n, y no permitir??n que otros utilicen,
              la Informaci??n Confidencial en beneficio de ninguna persona,
              entidad o instituci??n, sin el consentimiento por escrito de la
              otra parte, siempre que se reserven las disposiciones legales
              pertinentes.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Las partes est??n obligadas a tomar todo tipo de medidas necesarias
              para garantizar la privacidad de la informaci??n confidencial antes
              mencionada, a tomar todas y cada una de las precauciones{' '}
            </span>
            <span style={styles.style3}>para</span>
            <span style={styles.style3}>
              {' '}
              tal fin, a actuar de acuerdo con el principio de confidencialidad,
              evitar que dicha informaci??n sea utilizada por personas no
              autorizadas y protegerla de cualquier uso indebido
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Protecci??n de Datos Personales</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Puede encontrar</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style7}>aqu??</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>el </span>
            <span style={styles.style3}>
              aviso para la protecci??n de datos en posesi??n de particulares,{' '}
            </span>
            <span style={styles.style3}>acuerdo de confidencialidad</span>
            <span style={styles.style3}>
              de divulgaci??n y la declaraci??n de consentimiento sobre la
              protecci??n de sus datos personales dentro del ??mbito de su uso{' '}
            </span>
            <span style={styles.style3}>en </span>
            <span style={styles.style3}>el Sitio.</span>
            <span style={styles.style3}> [A??adir liga con la informaci??n]</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style2}>Terminaci??n del </span>
            <span style={styles.style2}>U</span>
            <span style={styles.style2}>so del Sitio</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              puede, en cualquier momento y a su entera discreci??n, revisar,
              suspender o cancelar su cuenta personal, registros de membres??a o
              usos similares a trav??s de este Sitio, en caso de que usted act??e
              en violaci??n de cualquier disposici??n legal aplicable o estos
              T??rminos.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Su obligaci??n de pago por los pedidos que{' '}
            </span>
            <span style={styles.style3}>haya </span>
            <span style={styles.style3}>realiz</span>
            <span style={styles.style3}>ado</span>
            <span style={styles.style3}>
              {' '}
              antes de la terminaci??n de su cuenta seguir?? siendo
            </span>
            <span style={styles.style3}>obligator</span>
            <span style={styles.style3}>o</span>
            <span style={styles.style3}>.</span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              En caso de cancelaci??n de su cuenta, usted no tendr?? ninguna
              cuenta o derechos de membres??a similares en el Sitio.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>
              Las limitaciones de responsabilidad y las disposiciones diversas
              dentro del alcance de estos T??rminos seguir??n siendo v??lidas
              despu??s de dicha terminaci??n.
            </span>
            <span style={styles.style3}>&#xa0;</span>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Canin</span>
            <span style={styles.style3}>
              {' '}
              puede notificarle la cancelaci??n de su cuenta a trav??s de la
              informaci??n de contacto que ha proporcionado a trav??s del Sitio
            </span>
            <span style={styles.style3}>.</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>Royal </span>
            <span style={styles.style3}>Can</span>
            <span style={styles.style3}>in</span>
            <span style={styles.style3}>
              {' '}
              se reserva el derecho de cambiar, suspender, cerrar o reanudar la
              totalidad o parte de este Sitio a su entera discreci??n sin previo
              aviso.
            </span>
          </p>
          <p style={styles.style1}>
            <span style={styles.style3}>&#xa0;</span>
          </p>
        </div>
      </div>
    );
  }
}
