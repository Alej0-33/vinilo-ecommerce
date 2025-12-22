import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  UserCheck, 
  Database,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  Server,
  Cookie,
  Globe,
  CheckCircle
} from 'lucide-react';

const PrivacyPolicy = () => {
  // Datos de la empresa
  const companyInfo = {
    name: import.meta.env.VITE_STORE_NAME,
    legalName: import.meta.env.VITE_LEGAL_NAME,
    nit: import.meta.env.VITE_STORE_NIT,
    email: import.meta.env.VITE_STORE_EMAIL,
    phone: import.meta.env.VITE_STORE_PHONE,
    address: import.meta.env.VITE_STORE_ADDRESS,
    lastUpdate: "14 de Diciembre de 2024"
  };

  const sections = [
    {
      id: "responsable",
      icon: <Shield size={20} />,
      title: "1. Responsable del Tratamiento",
      content: `
        En cumplimiento de la Ley Estatutaria 1581 de 2012 y el Decreto Reglamentario 1377 de 2013, informamos que los datos personales serán tratados por:

        • Razón Social: ${companyInfo.legalName}
        • NIT: ${companyInfo.nit}
        • Domicilio Principal: ${companyInfo.address}
        • Email de Contacto: ${companyInfo.email}
        • Teléfono: ${companyInfo.phone}

        Actuamos como RESPONSABLES del tratamiento de la información personal que recolectamos a través de nuestros canales digitales y físicos.
      `
    },
    {
      id: "marco-legal",
      icon: <FileText size={20} />,
      title: "2. Marco Legal y Definiciones",
      content: `
        Esta política se rige por el Artículo 15 de la Constitución Política de Colombia, la Ley 1581 de 2012 (Ley de Protección de Datos Personales) y sus decretos reglamentarios.

        Para efectos de esta política, se entiende por:
        • Autorización: Consentimiento previo, expreso e informado del Titular.
        • Dato Personal: Cualquier información vinculada a una persona natural.
        • Dato Sensible: Aquel que afecta la intimidad del Titular (ej. origen racial, salud, biométricos).
        • Encargado del Tratamiento: Quien realiza el tratamiento por cuenta del Responsable.
        • Titular: Persona natural cuyos datos son objeto de tratamiento (El Cliente).
      `
    },
    {
      id: "datos-recolectados",
      icon: <Database size={20} />,
      title: "3. Datos que Recolectamos",
      content: `
        Para la prestación de nuestros servicios, VINILO STORE puede recolectar:
        
        • Datos de Identificación: Nombre, apellido, número de cédula.
        • Datos de Contacto: Dirección física, ciudad, correo electrónico, teléfono móvil.
        • Datos Transaccionales: Historial de compras y métodos de pago (procesados de forma segura mediante pasarela certificada).
        • Datos de Navegación: Dirección IP, cookies y comportamiento en el sitio web.

        No recolectamos datos sensibles salvo autorización explícita y estrictamente necesaria según el Art. 6 de la Ley 1581 de 2012.
      `
    },
    {
      id: "finalidad",
      icon: <CheckCircle size={20} />,
      title: "4. Finalidad del Tratamiento",
      content: `
        La información recolectada tiene como propósitos principales:

        1. Gestionar el proceso de compra, facturación electrónica y envío de productos.
        2. Tramitar solicitudes, quejas y reclamos (PQR) y hacer efectivas garantías.
        3. Contactar al Cliente para confirmar pedidos o informar novedades logísticas.
        4. Enviar información comercial y promocional (solo si existe autorización previa).
        5. Cumplir obligaciones legales, contables y tributarias.
        6. Fortalecer medidas de seguridad y prevención de fraude.
      `
    },
    {
      id: "derechos-titular",
      icon: <UserCheck size={20} />,
      title: "5. Derechos del Titular (Habeas Data)",
      content: `
        Conforme al Art. 8 de la Ley 1581 de 2012, el Titular tiene derecho a:

        • Conocer, actualizar y rectificar sus datos personales frente a VINILO STORE.
        • Solicitar prueba de la autorización otorgada.
        • Ser informado sobre el uso que se ha dado a sus datos personales.
        • Presentar quejas ante la Superintendencia de Industria y Comercio (SIC).
        • Revocar la autorización y/o solicitar la supresión del dato cuando no se respeten los principios legales.
        • Acceder en forma gratuita a sus datos personales.
      `
    },
    {
      id: "politica-cookies",
      icon: <Cookie size={20} />,
      title: "6. Cookies y Rastreo",
      content: `
        Nuestro sitio web utiliza cookies propias y de terceros para mejorar la experiencia de usuario, analizar el tráfico y personalizar contenido.
        
        El usuario puede configurar su navegador para rechazar el uso de cookies, aunque esto podría limitar ciertas funcionalidades de la tienda online (como mantener productos en el carrito). El uso continuo del sitio implica la aceptación de esta política.
      `
    },
    {
      id: "seguridad",
      icon: <Lock size={20} />,
      title: "7. Seguridad de la Información",
      content: `
        Implementamos protocolos de seguridad técnica (Certificados SSL, encriptación), administrativa y humana para proteger los datos contra acceso no autorizado, adulteración o pérdida.
        
        Las transacciones de pago son procesadas directamente por pasarelas bancarias (ej. Wompi, PayU) con certificación PCI DSS; VINILO STORE no almacena códigos de seguridad (CVV) ni datos completos de tarjetas de crédito.
      `
    },
    {
      id: "transferencia",
      icon: <Globe size={20} />,
      title: "8. Compartición de Datos",
      content: `
        Podremos compartir datos estrictamente necesarios con terceros proveedores ("Encargados") para la operación del negocio:
        
        • Empresas de transporte y logística para realizar entregas.
        • Proveedores de infraestructura tecnológica y hosting.
        • Entidades procesadoras de pago.

        No vendemos, alquilamos ni comercializamos bases de datos con terceros para fines ajenos a la operación de VINILO STORE.
      `
    },
    {
      id: "procedimiento-pqrs",
      icon: <Server size={20} />,
      title: "9. Procedimiento para Ejercer Derechos",
      content: `
        Para ejercer sus derechos de Habeas Data, el Titular puede contactarnos así:

        9.1. Canal Oficial: Correo electrónico a ${companyInfo.email} con el asunto "Consulta/Reclamo Habeas Data".
        
        9.2. Requisitos: La solicitud debe incluir nombre completo, número de identificación, datos de contacto y descripción de la solicitud.

        9.3. Tiempos de Ley:
        • Consultas: Máximo 10 días hábiles, prorrogables por 5 días más.
        • Reclamos/Rectificaciones: Máximo 15 días hábiles, prorrogables por 8 días más.
      `
    },
    {
      id: "vigencia",
      icon: <Calendar size={20} />,
      title: "10. Vigencia",
      content: `
        Esta política entra en vigencia a partir del ${companyInfo.lastUpdate}. Las bases de datos se mantendrán vigentes durante el tiempo necesario para cumplir las finalidades mencionadas o el término exigido por la ley para la conservación de archivos contables.
      `
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar - Navegación de Contenido */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <h3 className="font-serif text-lg text-vinilo-black mb-4 pb-3 border-b border-gray-200">
                Índice
              </h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {sections.map((section) => (
                  <a 
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-xs text-gray-500 hover:text-vinilo-red hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors truncate"
                    title={section.title}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-[10px] text-gray-400 mb-1">Última actualización</p>
                <p className="text-xs text-vinilo-black font-medium">{companyInfo.lastUpdate}</p>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1 max-w-3xl">
            
            {/* Título de la Página */}
            <div className="mb-10 pb-8 border-b border-gray-200">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                <Lock size={12} /> Ley 1581 de 2012
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-vinilo-black mb-4">
                Política de Tratamiento de Datos
              </h1>
              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 leading-relaxed">
                    En <strong>{companyInfo.name}</strong> estamos comprometidos con la seguridad y privacidad de su información. Al navegar en este sitio, usted acepta nuestras políticas de privacidad y uso de cookies.
                  </p>
                </div>
              </div>
            </div>

            {/* Secciones del Documento */}
            <div className="space-y-12">
              {sections.map((section) => (
                <section 
                  key={section.id} 
                  id={section.id}
                  className="scroll-mt-24 group"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-vinilo-red group-hover:bg-vinilo-red group-hover:text-white transition-colors">
                      {section.icon}
                    </div>
                    <h2 className="font-serif text-xl text-vinilo-black">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="ml-4 pl-6 border-l-2 border-gray-100 group-hover:border-vinilo-red/20 transition-colors">
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n').map((paragraph, idx) => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return null;
                        
                        // Formateo de listas
                        if (trimmed.startsWith('•')) {
                          return (
                            <div key={idx} className="flex items-start gap-2 my-2">
                              <span className="text-vinilo-red font-bold mt-1.5 h-1.5 w-1.5 rounded-full bg-current block flex-shrink-0"></span>
                              <span className="text-gray-600 text-sm leading-relaxed">
                                {trimmed.substring(1).trim()}
                              </span>
                            </div>
                          );
                        }
                        
                        // Formateo de subtítulos numerados
                        if (/^\d+\.\d+\./.test(trimmed)) {
                           const [num, ...rest] = trimmed.split(':');
                           return (
                             <p key={idx} className="text-gray-700 font-medium text-sm mt-4 mb-2">
                               {num}: <span className="text-gray-600 font-normal">{rest.join(':')}</span>
                             </p>
                           );
                        }

                        // Párrafos normales
                        return (
                          <p key={idx} className="text-gray-600 text-sm leading-relaxed my-3 text-justify">
                            {trimmed}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Bloque de Contacto Simple (Sin estilo de footer global) */}
            <div className="mt-16 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="font-serif text-vinilo-black mb-2 flex items-center gap-2">
                <Mail size={16} /> ¿Dudas sobre su privacidad?
              </h4>
              <p className="text-sm text-gray-500 mb-4">
                Para consultas relacionadas con protección de datos personales, contacte a nuestro oficial de privacidad:
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                 <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-2 rounded border border-gray-100">
                    <Mail size={14} className="text-vinilo-red" />
                    {companyInfo.email}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-gray-700 bg-white px-3 py-2 rounded border border-gray-100">
                    <MapPin size={14} className="text-vinilo-red" />
                    Medellín, Colombia
                 </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;