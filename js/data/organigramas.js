/**
 * ESTRUCTURAS DE LOS ORGANIGRAMAS
 *
 * Los organigramas definen cargos y relaciones, no nombres de personajes.
 * Para ocupar un cargo, la ficha del personaje debe tener el mismo `rank`.
 * La búsqueda ignora mayúsculas, tildes y espacios sobrantes.
 *
 * Si cambias el `rank` de una ficha, el personaje cambia automáticamente
 * de posición al volver a cargar la página.
 */

export default {
  harem: {
    root: {
      title: "Valide de facto",
      rank: "Valide de facto",
      description: "Autoridad superior de la casa imperial por delegación del sultán.",
      children: [
        {
          title: "Haseki Sultan",
          rank: "Haseki Sultan",
          description: "Consorte principal y figura de mayor precedencia entre las consortes.",
          children: [
            { title: "Baş Kadın", rank: "Baş Kadın", description: "Consortes de precedencia elevada." },
            { title: "İkbal", rank: "İkbal", description: "Consortes favorecidas reconocidas por la corte." }
          ]
        },
        {
          title: "Kethüda Kadın",
          rank: "Kethüda Kadın",
          description: "Responsable de la coordinación y administración de la casa interior.",
          children: [
            {
              title: "Kalfa",
              rank: "Kalfa",
              description: "Personal experimentado que supervisa tareas y formación.",
              children: [
                { title: "Cariye", rank: "Cariye", description: "Personal en formación y servicio de la casa interior." },
                { title: "Cariye personal de Otoha Sultán", rank: "Cariye personal de Otoha Sultán", description: "Servicio personal asignado a Otoha." },
                { title: "Cariye personal de Tarae Haseki Sultan", rank: "Cariye Personal de Tarae Haseki Sultan", description: "Servicio personal asignado a Tarae." }
              ]
            }
          ]
        }
      ]
    }
  },

  government: {
    rootTitle: "Sultanato de Osamu",
    rootKicker: "Autoridad suprema",
    rootDescription: "El soberano encabeza el Estado y preside la autoridad imperial.",
    offices: [
      { title: "Sadrazam", rank: "Sadrazam", translation: "Gran visir", purpose: "Dirige el gobierno central y coordina los asuntos del Diván.", group: "Dirección del Diván" },
      { title: "Vezirler", rank: "Vezirler", translation: "Visires", purpose: "Asisten en la administración imperial y en las decisiones del consejo.", group: "Dirección del Diván" },
      { title: "Defterdar", rank: "Defterdar", translation: "Responsable del tesoro", purpose: "Administra las finanzas, los ingresos y las cuentas del Estado.", group: "Administración central" },
      { title: "Kazasker", rank: "Kazasker", translation: "Autoridad judicial", purpose: "Atiende asuntos judiciales y supervisa la administración de justicia.", group: "Administración central" },
      { title: "Nişancı", rank: "Nişancı", translation: "Cancillería imperial", purpose: "Formaliza decretos y custodia la documentación oficial y los sellos.", group: "Administración central" },
      { title: "Reisülküttab", rank: "Reisülküttab", translation: "Jefe de escribanos y asuntos exteriores", purpose: "Coordina la secretaría del Diván, la correspondencia oficial y la documentación diplomática.", group: "Administración central" },
      { title: "Kaptan-ı Derya", rank: "Kaptan-ı Derya", translation: "Gran almirante de la flota", purpose: "Ejerce el mando superior de la armada imperial y dirige los asuntos navales.", group: "Mando militar" },
      { title: "Yeniçeri Ağası", rank: "Yeniçeri Ağası", translation: "Ağa de los jenízaros", purpose: "Comanda el cuerpo de jenízaros y atiende su disciplina y organización.", group: "Mando militar" },
      { title: "Şeyhülislam", rank: "Şeyhülislam", translation: "Máxima autoridad religiosa y jurídica", purpose: "Emite dictámenes jurídicos religiosos y ejerce autoridad en asuntos de interpretación de la ley islámica.", group: "Autoridad religiosa y jurídica" }
    ]
  },

  administration: {
    rootTitle: "Servicio y administración del palacio",
    rootKicker: "Saray-ı Hümâyun",
    rootDescription: "Los oficios se distribuyen por responsabilidad, dependencia y acceso autorizado.",
    groups: [
      {
        title: "Administración y protocolo",
        description: "Accesos, portería y coordinación de servicios.",
        offices: [
          { title: "Kızlar Ağası", rank: "Kızlar Ağası", translation: "Administrador del harén", purpose: "Coordina el servicio autorizado y la organización interna del harén." },
          { title: "Kapıcıbaşı", rank: "Kapıcıbaşı", translation: "Jefe de porteros", purpose: "Organiza a los porteros y controla las entradas ceremoniales y los accesos autorizados." }
        ]
      },
      {
        title: "Jardines y espacios exteriores",
        description: "Custodia y mantenimiento de los espacios exteriores.",
        offices: [
          { title: "Bostancıbaşı", rank: "Bostancıbaşı", translation: "Jefe de jardines y guardias exteriores", purpose: "Supervisa jardines, espacios exteriores y tareas de vigilancia asignadas." }
        ]
      },
      {
        title: "Protección personal",
        description: "Guardia asignada a la familia imperial y a sus residencias.",
        offices: [
          { title: "Muhafız-ı Hassa", rank: "Muhafız-ı Hassa", translation: "Guardia personal", purpose: "Protege a las personas que tiene encomendadas conforme a las órdenes de la corte." }
        ]
      },
      {
        title: "Servicio de la casa interior",
        description: "Supervisión cotidiana de las dependencias y del personal.",
        offices: [
          { title: "Kethüda Kadın", rank: "Kethüda Kadın", translation: "Administración de la casa interior", purpose: "Coordina al personal y las necesidades de las residentes." },
          { title: "Kalfa", rank: "Kalfa", translation: "Supervisora experimentada", purpose: "Coordina labores cotidianas y acompaña la formación del personal." },
          { title: "Matbah-ı Âmire Emini", rank: "Matbah-ı Âmire Emini", translation: "Responsable de las cocinas imperiales", purpose: "Coordina el abastecimiento, la preparación de alimentos y el servicio de cocina." },
          { title: "Hazinedar Usta", rank: "Hazinedar Usta", translation: "Custodia de la tesorería doméstica", purpose: "Lleva el registro y la custodia de los bienes asignados a la casa interior." }
        ]
      }
    ]
  },

  nobility: {
    rootTitle: "Casas nobles del Imperio",
    rootKicker: "Ümerâ ve Eşraf",
    rootDescription: "Linajes, matrimonios, descendencia y servicios que vinculan a las casas con la corte.",
    houses: [
      { name: "Casa Ushijima", description: "Casa noble encabezada históricamente por Wakatoshi Bey." },
      { name: "Casa Bokuto", description: "Casa vinculada a la nobleza militar y a la administración de sus dominios." },
      { name: "Casa Kuroo", description: "Casa con vínculos militares, comerciales y territoriales." },
      { name: "Casa Tendō", description: "Casa individual registrada en torno a Satori Tendō." },
      { name: "Casa Sakusa", description: "Casa individual de rango pachá." },
      { name: "Casa Iwaizumi", description: "Casa noble de tradición militar y administración de dominios." },
      { name: "Casa Haiba", description: "Casa de la nobleza de origen extranjero." }
    ]
  }
};
