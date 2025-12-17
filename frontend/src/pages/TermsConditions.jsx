import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ScrollText, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  Scale,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  Package,
  AlertCircle
} from 'lucide-react';

const TermsConditions = () => {
  const companyInfo = {
    name: import.meta.env.VITE_STORE_NAME,
    legalName: import.meta.env.VITE_LEGAL_NAME,
    nit: import.meta.env.VITE_STORE_NIT,
    email: import.meta.env.VITE_STORE_EMAIL,
    phone: import.meta.env.VITE_STORE_PHONE,
    address: import.meta.env.VITE_STORE_ADDRESS,
    website: import.meta.env.VITE_STORE_WEBSITE,
    lastUpdate: "14 de Diciembre de 2024"
  };


  const sections = [
    {
      id: "informacion-general",
      icon: <FileText size={20} />,
      title: "1. Información General",
      content: `
        Los presentes Términos y Condiciones regulan el uso del sitio web ${companyInfo.website} (en adelante, "el Sitio") y la relación comercial entre ${companyInfo.legalName}, identificada con NIT ${companyInfo.nit}, con domicilio en ${companyInfo.address} (en adelante, "VINILO STORE" o "nosotros") y los usuarios o clientes que accedan al Sitio y/o realicen compras a través del mismo (en adelante, "el Usuario" o "el Cliente").

        Al acceder, navegar o utilizar este Sitio, el Usuario acepta haber leído, entendido y estar de acuerdo con estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le solicitamos abstenerse de usar nuestro Sitio.

        Estos términos se rigen por la legislación colombiana, especialmente por la Ley 1480 de 2011 (Estatuto del Consumidor), la Ley 1581 de 2012 (Protección de Datos Personales) y demás normas concordantes.
      `
    },
    {
      id: "productos-precios",
      icon: <Package size={20} />,
      title: "2. Productos y Precios",
      content: `
        2.1. DESCRIPCIÓN DE PRODUCTOS: VINILO STORE se esfuerza por presentar información precisa sobre los productos ofrecidos, incluyendo descripciones, fotografías, tallas y características. Sin embargo, las imágenes son de carácter ilustrativo y pueden presentar ligeras variaciones con respecto al producto físico debido a la configuración de pantalla de cada dispositivo.

        2.2. PRECIOS: Todos los precios publicados en el Sitio están expresados en Pesos Colombianos (COP) e incluyen el Impuesto al Valor Agregado (IVA) cuando aplique. Los precios pueden cambiar sin previo aviso, pero los cambios no afectarán los pedidos ya confirmados.

        2.3. DISPONIBILIDAD: La disponibilidad de los productos está sujeta al stock existente. En caso de que un producto no esté disponible después de realizada la compra, VINILO STORE se comunicará con el Cliente para ofrecer alternativas o proceder con el reembolso correspondiente.

        2.4. ERRORES DE PRECIO: En caso de que se publique un precio erróneo de manera evidente, VINILO STORE se reserva el derecho de cancelar la orden y realizar el reembolso correspondiente, notificando al Cliente de dicha situación.
      `
    },
    {
      id: "proceso-compra",
      icon: <CreditCard size={20} />,
      title: "3. Proceso de Compra",
      content: `
        3.1. REGISTRO: Para realizar una compra, el Usuario puede registrarse en el Sitio o comprar como invitado. Al registrarse, el Usuario se compromete a proporcionar información veraz, completa y actualizada.

        3.2. PEDIDO: El proceso de compra incluye: (a) selección de productos, (b) revisión del carrito de compras, (c) ingreso de datos de envío, (d) selección del método de pago, y (e) confirmación del pedido.

        3.3. CONFIRMACIÓN: Una vez confirmado el pedido, el Cliente recibirá un correo electrónico con el resumen de su compra y el número de referencia. Este correo NO constituye aceptación del pedido, la cual queda sujeta a la verificación del pago y disponibilidad del producto.

        3.4. ACEPTACIÓN: VINILO STORE se reserva el derecho de aceptar o rechazar cualquier pedido por razones legítimas, incluyendo pero no limitado a: sospecha de fraude, información incorrecta, indisponibilidad de producto o problemas con el pago.

        3.5. CAPACIDAD LEGAL: Al realizar una compra, el Usuario declara ser mayor de edad (18 años) y tener capacidad legal para contratar. Los menores de edad deben realizar compras bajo supervisión de sus padres o tutores legales.
      `
    },
    {
      id: "metodos-pago",
      icon: <CreditCard size={20} />,
      title: "4. Métodos de Pago",
      content: `
        4.1. FORMAS DE PAGO: VINILO STORE ofrece los siguientes métodos de pago:
        
        • Pago Contraentrega (COD): El Cliente paga en efectivo al momento de recibir el producto en la dirección de entrega indicada.
        
        • Pasarela de Pagos (Wompi): Tarjetas de crédito y débito (Visa, Mastercard, American Express), PSE (transferencia bancaria), Nequi y Bancolombia.

        4.2. SEGURIDAD: Las transacciones electrónicas se procesan a través de plataformas seguras con certificación PCI-DSS. VINILO STORE no almacena datos de tarjetas de crédito o débito.

        4.3. VERIFICACIÓN: VINILO STORE se reserva el derecho de verificar la identidad del titular de la tarjeta o cuenta bancaria antes de procesar el pedido.

        4.4. FACTURACIÓN: Por cada compra se emitirá factura electrónica de venta conforme a la normatividad tributaria colombiana vigente, la cual será enviada al correo electrónico registrado.
      `
    },
    {
      id: "envios",
      icon: <Truck size={20} />,
      title: "5. Política de Envíos",
      content: `
        5.1. COBERTURA: VINILO STORE realiza envíos a todo el territorio colombiano a través de empresas transportadoras autorizadas.

        5.2. COSTOS DE ENVÍO: El costo de envío se calcula según la ubicación de destino y se muestra al Cliente antes de confirmar la compra. VINILO STORE podrá ofrecer envío gratuito en promociones específicas o para compras que superen un monto determinado.

        5.3. TIEMPOS DE ENTREGA: 
        • Ciudades principales: 2 a 5 días hábiles
        • Ciudades intermedias: 5 a 8 días hábiles  
        • Zonas rurales o de difícil acceso: 8 a 15 días hábiles
        
        Estos tiempos son estimados y pueden variar por causas ajenas a VINILO STORE (clima, orden público, fuerza mayor).

        5.4. SEGUIMIENTO: Una vez despachado el pedido, el Cliente recibirá por correo electrónico el número de guía para rastrear su envío.

        5.5. RECEPCIÓN: Al recibir el producto, el Cliente debe verificar el estado del empaque. Si presenta daños visibles, debe reportarlo inmediatamente a la transportadora y a VINILO STORE.

        5.6. DIRECCIÓN INCORRECTA: Si el pedido no puede ser entregado por información incorrecta proporcionada por el Cliente, los costos adicionales de reenvío serán asumidos por el Cliente.
      `
    },
    {
      id: "derecho-retracto",
      icon: <RotateCcw size={20} />,
      title: "6. Derecho de Retracto",
      content: `
        6.1. PLAZO: De conformidad con el artículo 47 de la Ley 1480 de 2011 (Estatuto del Consumidor), el Cliente tiene derecho a retractarse de la compra dentro de los CINCO (5) DÍAS HÁBILES siguientes a la entrega del producto, sin necesidad de justificar su decisión y sin penalidad alguna.

        6.2. CONDICIONES: Para ejercer el derecho de retracto, el producto debe:
        • Estar en su empaque original, sin usar y con todas sus etiquetas
        • No presentar signos de uso, deterioro o manipulación
        • Incluir todos los accesorios, manuales y obsequios que venían con el producto
        • Estar acompañado de la factura de compra

        6.3. PROCEDIMIENTO: Para ejercer este derecho, el Cliente debe:
        1. Contactar a VINILO STORE al correo ${companyInfo.email} o al teléfono ${companyInfo.phone}
        2. Indicar el número de pedido y el motivo del retracto
        3. Enviar el producto a la dirección indicada por VINILO STORE

        6.4. COSTOS: Los costos de envío para la devolución del producto serán asumidos por el Cliente, salvo que el retracto se deba a defectos del producto o error de VINILO STORE.

        6.5. REEMBOLSO: Una vez recibido y verificado el producto, VINILO STORE procederá al reembolso del valor pagado dentro de los TREINTA (30) DÍAS CALENDARIO siguientes, utilizando el mismo medio de pago empleado por el Cliente.

        6.6. EXCEPCIONES: No aplica derecho de retracto para productos personalizados, productos de higiene personal una vez abiertos, o productos en promoción con condiciones especiales previamente informadas.
      `
    },
    {
      id: "garantias",
      icon: <ShieldCheck size={20} />,
      title: "7. Garantías",
      content: `
        7.1. GARANTÍA LEGAL: Todos los productos comercializados por VINILO STORE cuentan con garantía legal de calidad e idoneidad conforme al Estatuto del Consumidor colombiano.

        7.2. TÉRMINO: El término de garantía para calzado es de TREINTA (30) DÍAS contados a partir de la entrega del producto, salvo que el fabricante ofrezca un término mayor.

        7.3. COBERTURA: La garantía cubre defectos de fabricación, materiales defectuosos o vicios ocultos que afecten el funcionamiento o uso normal del producto.

        7.4. EXCLUSIONES: La garantía NO cubre:
        • Daños por uso inadecuado, negligencia o accidentes
        • Desgaste normal por uso
        • Modificaciones o reparaciones no autorizadas
        • Daños causados por agentes externos (agua, fuego, etc.)
        • Daños estéticos que no afecten la funcionalidad

        7.5. PROCEDIMIENTO: Para hacer efectiva la garantía:
        1. Contactar a VINILO STORE dentro del período de garantía
        2. Describir el defecto presentado
        3. Enviar el producto para evaluación técnica
        4. VINILO STORE determinará si procede reparación, cambio o devolución del dinero

        7.6. TIEMPOS: La evaluación se realizará en un plazo máximo de QUINCE (15) DÍAS HÁBILES. Si procede la garantía, la solución se implementará en un plazo razonable que será comunicado al Cliente.
      `
    },
    {
      id: "devoluciones",
      icon: <RotateCcw size={20} />,
      title: "8. Política de Devoluciones y Cambios",
      content: `
        8.1. CAMBIOS POR TALLA: VINILO STORE ofrece cambio de talla dentro de los DIEZ (10) DÍAS HÁBILES siguientes a la recepción del producto, sujeto a disponibilidad de inventario.

        8.2. CONDICIONES PARA CAMBIOS:
        • El producto debe estar sin usar y en su empaque original
        • Debe conservar todas las etiquetas
        • El Cliente asume los costos de envío del cambio

        8.3. DEVOLUCIONES POR DEFECTOS: Si el producto presenta defectos de fabricación o no corresponde a lo ordenado, VINILO STORE asumirá todos los costos de devolución y enviará el producto correcto o realizará el reembolso según preferencia del Cliente.

        8.4. PRODUCTOS NO ACEPTADOS: No se aceptan devoluciones de productos:
        • Usados o con signos de uso
        • Sin empaque original
        • Sin etiquetas
        • Dañados por el Cliente
        • Fuera del plazo establecido

        8.5. PROCESO DE REEMBOLSO: Los reembolsos se procesarán dentro de los TREINTA (30) DÍAS CALENDARIO siguientes a la recepción del producto devuelto, una vez verificado su estado.
      `
    },
    // SE ELIMINÓ LA SECCIÓN DE PROTECCIÓN DE DATOS
    {
      id: "propiedad-intelectual",
      icon: <FileText size={20} />,
      title: "9. Propiedad Intelectual",
      content: `
        9.1. DERECHOS: Todo el contenido del Sitio, incluyendo pero no limitado a textos, gráficos, logos, imágenes, fotografías, diseños, software y código fuente, es propiedad de VINILO STORE o de sus proveedores de contenido, y está protegido por las leyes colombianas e internacionales de propiedad intelectual.

        9.2. USO PERMITIDO: El Usuario puede visualizar y descargar el contenido del Sitio únicamente para uso personal y no comercial, siempre que mantenga intactos todos los avisos de derechos de autor y propiedad.

        9.3. RESTRICCIONES: Está prohibido:
        • Reproducir, duplicar, copiar, vender o explotar comercialmente cualquier parte del Sitio
        • Modificar o crear obras derivadas del contenido
        • Utilizar técnicas de minería de datos o similares
        • Usar el contenido para entrenar sistemas de inteligencia artificial sin autorización

        9.4. MARCAS: Las marcas comerciales mostradas en el Sitio pertenecen a sus respectivos propietarios y su uso en el Sitio no constituye autorización para su utilización por parte del Usuario.
      `
    },
    {
      id: "limitacion-responsabilidad",
      icon: <AlertCircle size={20} />,
      title: "10. Limitación de Responsabilidad",
      content: `
        10.1. DISPONIBILIDAD: VINILO STORE no garantiza que el Sitio estará disponible de forma ininterrumpida o libre de errores. Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del Sitio en cualquier momento.

        10.2. CONTENIDO DE TERCEROS: El Sitio puede contener enlaces a sitios web de terceros. VINILO STORE no es responsable del contenido, políticas de privacidad o prácticas de dichos sitios.

        10.3. DAÑOS: En la máxima medida permitida por la ley, VINILO STORE no será responsable por daños indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de uso del Sitio o los productos.

        10.4. FUERZA MAYOR: VINILO STORE no será responsable por retrasos o incumplimientos causados por eventos de fuerza mayor, caso fortuito, desastres naturales, conflictos laborales, actos gubernamentales, fallas en telecomunicaciones, o cualquier otra causa fuera de nuestro control razonable.

        10.5. LÍMITE: En cualquier caso, la responsabilidad total de VINILO STORE frente al Cliente no excederá el monto pagado por el producto objeto de la reclamación.
      `
    },
    {
      id: "disposiciones-generales",
      icon: <Scale size={20} />,
      title: "11. Disposiciones Generales",
      content: `
        11.1. MODIFICACIONES: VINILO STORE se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en el Sitio. El uso continuado del Sitio después de dichas modificaciones constituye aceptación de los nuevos términos.

        11.2. NOTIFICACIONES: Las comunicaciones entre VINILO STORE y el Cliente se realizarán preferentemente por correo electrónico a las direcciones registradas.

        11.3. CESIÓN: El Cliente no podrá ceder sus derechos u obligaciones bajo estos Términos sin el consentimiento previo y por escrito de VINILO STORE.

        11.4. NULIDAD PARCIAL: Si alguna disposición de estos Términos es declarada inválida o inaplicable, las demás disposiciones permanecerán en pleno vigor y efecto.

        11.5. RENUNCIA: La falta de ejercicio de cualquier derecho por parte de VINILO STORE no constituirá renuncia al mismo.

        11.6. ACUERDO COMPLETO: Estos Términos y Condiciones, junto con la Política de Privacidad, constituyen el acuerdo completo entre el Usuario y VINILO STORE respecto al uso del Sitio.
      `
    },
    {
      id: "legislacion-jurisdiccion",
      icon: <Scale size={20} />,
      title: "12. Legislación Aplicable y Jurisdicción",
      content: `
        12.1. LEY APLICABLE: Estos Términos y Condiciones se rigen por las leyes de la República de Colombia.

        12.2. RESOLUCIÓN DE CONFLICTOS: Cualquier controversia que surja de estos Términos se resolverá preferentemente mediante negociación directa entre las partes.

        12.3. MECANISMOS ALTERNATIVOS: En caso de no llegar a un acuerdo, las partes podrán acudir a los mecanismos alternativos de solución de conflictos previstos en la ley colombiana.

        12.4. JURISDICCIÓN: Para cualquier controversia que no pueda ser resuelta por los medios anteriores, las partes se someten a la jurisdicción de los jueces y tribunales de la ciudad de Medellín, Colombia.

        12.5. SUPERINTENDENCIA: Sin perjuicio de lo anterior, el consumidor podrá acudir en cualquier momento ante la Superintendencia de Industria y Comercio para la protección de sus derechos como consumidor.
      `
    },
    {
      id: "contacto",
      icon: <Mail size={20} />,
      title: "13. Información de Contacto",
      content: `
        Para cualquier pregunta, comentario, solicitud o reclamación relacionada con estos Términos y Condiciones, nuestros productos o servicios, puede contactarnos a través de:

        Razón Social: ${companyInfo.legalName}
        NIT: ${companyInfo.nit}
        Dirección: ${companyInfo.address}
        Correo electrónico: ${companyInfo.email}
        Teléfono: ${companyInfo.phone}
        Sitio web: ${companyInfo.website}

        Horario de atención: Lunes a Viernes de 8:00 AM a 6:00 PM
        Sábados de 9:00 AM a 1:00 PM

        Nos comprometemos a responder todas las solicitudes en un plazo máximo de QUINCE (15) DÍAS HÁBILES conforme a la normatividad vigente.
      `
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar - Tabla de Contenidos */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-24 bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
              <h3 className="font-serif text-lg text-vinilo-black mb-4 pb-3 border-b border-gray-200">
                Contenido
              </h3>
              <nav className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-xs text-gray-500 hover:text-vinilo-red hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
              
              {/* Info de actualización */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  <Calendar size={12} />
                  <span>Última actualización:</span>
                </div>
                <p className="text-xs text-vinilo-black font-medium mt-1">
                  {companyInfo.lastUpdate}
                </p>
              </div>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="flex-1 max-w-3xl">
            
            {/* Header del documento (Título de página) */}
            <div className="mb-12 pb-8 border-b border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-vinilo-red/10 rounded-full flex items-center justify-center">
                  <ScrollText size={24} className="text-vinilo-red" />
                </div>
                <div>
                  <h1 className="font-serif text-3xl md:text-4xl text-vinilo-black">
                    Términos y Condiciones
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">
                    {companyInfo.legalName}
                  </p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">
                      Importante
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Al realizar una compra en nuestro sitio web, usted acepta estos términos y condiciones en su totalidad. 
                      Le recomendamos leer este documento detenidamente antes de realizar cualquier transacción.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secciones */}
            <div className="space-y-12">
              {sections.map((section) => (
                <section 
                  key={section.id} 
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-vinilo-red">
                      {section.icon}
                    </div>
                    <h2 className="font-serif text-xl text-vinilo-black">
                      {section.title}
                    </h2>
                  </div>
                  
                  <div className="pl-13 ml-5 border-l-2 border-gray-100 pl-6">
                    <div className="prose prose-sm max-w-none">
                      {section.content.split('\n').map((paragraph, idx) => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return null;
                        
                        // Detectar si es un item de lista
                        if (trimmed.startsWith('•')) {
                          return (
                            <p key={idx} className="text-gray-600 text-sm leading-relaxed my-1 flex items-start gap-2">
                              <span className="text-vinilo-red mt-1">•</span>
                              <span>{trimmed.substring(1).trim()}</span>
                            </p>
                          );
                        }
                        
                        // Detectar subtítulos numerados (2.1., 3.2., etc.)
                        if (/^\d+\.\d+\./.test(trimmed)) {
                          const [number, ...rest] = trimmed.split(':');
                          return (
                            <p key={idx} className="text-gray-600 text-sm leading-relaxed mt-4 mb-2">
                              <strong className="text-vinilo-black">{number}:</strong>
                              {rest.join(':')}
                            </p>
                          );
                        }
                        
                        return (
                          <p key={idx} className="text-gray-600 text-sm leading-relaxed my-3">
                            {trimmed}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ))}
            </div>

            {/* Bloque de Contacto Final (Informacional) */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-serif text-lg text-vinilo-black mb-4 flex items-center gap-2">
                  <Mail size={18} className="text-vinilo-red" />
                  ¿Tienes preguntas?
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Si tienes alguna duda sobre estos términos y condiciones, no dudes en contactarnos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a 
                    href={`mailto:${companyInfo.email}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-vinilo-red hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-vinilo-red/10 rounded-full flex items-center justify-center group-hover:bg-vinilo-red transition-colors">
                      <Mail size={18} className="text-vinilo-red group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Email</p>
                      <p className="text-xs text-vinilo-black truncate">{companyInfo.email}</p>
                    </div>
                  </a>
                  
                  <a 
                    href={`tel:${companyInfo.phone}`}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-vinilo-red hover:shadow-md transition-all group"
                  >
                    <div className="w-10 h-10 bg-vinilo-red/10 rounded-full flex items-center justify-center group-hover:bg-vinilo-red transition-colors">
                      <Phone size={18} className="text-vinilo-red group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Teléfono</p>
                      <p className="text-xs text-vinilo-black">{companyInfo.phone}</p>
                    </div>
                  </a>
                  
                  <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                    <div className="w-10 h-10 bg-vinilo-red/10 rounded-full flex items-center justify-center">
                      <MapPin size={18} className="text-vinilo-red" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 font-bold">Ubicación</p>
                      <p className="text-xs text-vinilo-black">Medellín, Colombia</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Botón volver */}
              <div className="mt-8 text-center">
                <Link 
                  to="/"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-vinilo-black text-white text-xs font-bold uppercase tracking-widest hover:bg-vinilo-red transition-colors rounded-lg"
                >
                  <ChevronLeft size={16} />
                  Volver al Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;