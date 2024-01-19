export const FormSelectValues = {
    //? ---------------------------------------  WIRELES ----------------------------------------------
    MAIN_PROBLEM_W: [ 'Antena', 'UTP', 'Alimentacion', 'Router', 'Patch', 'RJ45' ],
    MAIN_SOLUTION_ANTENA_W: [ 
        'Instalación completa de antena con mastil',
        'Cambio de CPE', 
        'Redireccionar', 
        'Modificar altura', 
        'Mover la antena con mastil de lugar original', 
        'Configuración completa de CPE sin cambiarlo', 
        'Tensar/Amurar antena' 
    ],
    MAIN_SOLUTION_UTP_W: [
        'Se utiliza ganancia',
        'Se recablea nuevamente'
    ],
    MAIN_SOLUTION_ALIMENTACION_W: [
        'Cambio del POE',
        'Reconexión del POE', 
        'Cambio del transformador del router',
        'Reconexión del transformador del router',
    ],
    MAIN_SOLUTION_ROUTER_W: [
        'Cambio de equipo',
        'Configuración de equipo'
    ],
    MAIN_SOLUTION_PATCH_W: [
        'Cambio de patch',
        'Reconexión de patch'
    ],
    MAIN_SOLUTION_RJ45_W: [
        'Cambio de RJ45',
        'Reconexión de RJ45'
    ],
    MAIN_REASON_ANTENA_1_W: [
        'Robo',
        'Rotura (desgaste)',
        'Rotura (condiciones climáticas)',
        'Cambio de Nodo (vista tapada)',
        'Cambio de Nodo (dado de baja)',
        'Cambio de Nodo (saturación de AP)',
    ],
    MAIN_REASON_ANTENA_2_W: [
        'Robo',
        'Rotura (desgaste)',
        'Rotura (condiciones climáticas)',
        'Cambio de Nodo (distancia)',
    ],
    MAIN_REASON_ANTENA_3_W: [
        'Cambio de Nodo (vista tapada)',
        'Cambio de Nodo (dado de baja)',
        'Cambio de Nodo (saturación de AP)',
    ],
    MAIN_REASON_ANTENA_4_W: [
        'Para mejorar la señal',
        'Otro'
    ],
    MAIN_REASON_ANTENA_5_W: [
        'Para mejorar la señal',
        'Otro'
    ],
    MAIN_REASON_ANTENA_6_W: [
        'Se reinicio ya que no respondía',
        'Mal configurado anteriormente',
        'Estaba reiniciado de fábrica'
    ],
    MAIN_REASON_ANTENA_7_W: [
        'Robo',
        'Perdida del punto de anclaje',
        'Corte de alambre',
        'Mal uso del tensor',
        'Caños rotos'
    ],
    MAIN_REASON_UTP_1_W: [
        'Rotura de cable por sulfatación',
        'Rotura de cable por manipulación del cliente',
        'Rotura de cable por estar mal pasado',
        'Desgaste del cable'
    ],
    MAIN_REASON_UTP_2_W: [
        'Rotura de cable por sulfatación',
        'Rotura de cable por manipulación del cliente',
        'Rotura de cable por estar mal pasado',
        'Desgaste del cable'
    ],
    MAIN_REASON_ALIMENTACION_1_W: [
        'Rotura (desgaste)',
        'Rotura (condiciones climáticas)',
        'Rotura (por manipulación del cliente)',
        'POE incorrecto'  
    ],
    MAIN_REASON_ALIMENTACION_2_W: [
        'El POE estaba desconectado (por manipulación del cliente)',
        'Otro'
    ],
    MAIN_REASON_ALIMENTACION_3_W: [
        'Rotura (desgaste)',
        'Rotura (subida de tensión)',
        'Rotura (por manipulación del cliente)',
        'Transformador incorrecto'
    ],
    MAIN_REASON_ALIMENTACION_4_W: [
        'Desconectado (por manipulación del cliente)',
        'Otro'
    ],
    MAIN_REASON_ROUTER_1_W: [
        'Robo',
        'Rotura (desgaste)',
        'Rotura (por manipulación del cliente)',
        'Por cambio de plan',
        'Problemas de velocidad',
        'Problemas de cobertura',
        'Equipo quemado (falla electrica)',
        'Equipo quemado (alimentación incorrecta)',
    ],
    MAIN_REASON_ROUTER_2_W: [
        'Se reinicio ya que no respondía',
        'Mal configurado anteriormente',
        'Estaba reiniciado de fábrica (por manipulación del cliente)'
    ],
    MAIN_REASON_PATCH_1_W: [
        'Rotura (desgaste)',
        'Rotura (por manipulación del cliente)',
        'Rotura (fallas)'
    ],
    MAIN_REASON_PATCH_2_W: [
        'Desconectado o mal conectado (por manipulación del cliente)',
        'Otro'
    ],
    MAIN_REASON_RJ45_1_W: [
        'Rotura (sulfatación)',
        'Rotura (mal armado)',
        'Rotura (por manipulación del cliente)',
        'Rotura (condiciones climáticas)'
    ],
    MAIN_REASON_RJ45_2_W: [
        'Desconectado o mal conectado (por manipulación del cliente)',
        'Otro'
    ],
    ROUTER_TYPE_W: [
        'ARCHER A6 AC1200',
        'ARCHER C20W',
        'ARCHER C5 AGILE DUAL',
        'ARCHER C80 AC1900',
        'DECO E4 AC1200 (3 PACK)',
        'DECO E4 AC1200 (PACK 2)',
        'DECO M4 AC1200 (2 PACK)',
        'DECO M4 AC1200 (3 PACK)',
        'OMADA EAP225-OUTDOOR V1. AC1200',
        'ROUTER TP-LINK ARCHER C80 AC1900',
        'TL-WR740N',
        'TL-WR820N',
        'TL-WR840N',
        'TL-WR850N',
        'TL-WR940N',
        'WR841N',
        'Otro'
    ],
    //? ------------------------------------------  FO --------------------------------------------------------
    MAIN_PROBLEM_FO: [ 'Drop', 'Conectores', 'ONU', 'Acople', 'Patch', 'Alimentacion' ],
    MAIN_REASON_DROP_FO: [
        'Corte de drop exterior (Poda)',
        'Corte de drop exterior (condiciones climáticas)',
        'Corte de drop exterior (factor externo-corte intencional)',
        'Corte de drop exterior (factor externo-vehículo)',
        'Corte de drop exterior (manipulación del cliente)',
        'Corte de drop interior (manipulación del cliente)',
        'Corte de drop interior (mala instalación)',
        'Fibra exterior atenuada (por rama debido a poda)',
        'Fibra exterior atenuada (por rama debido condiciones climaticas)',
    ],
    MAIN_REASON_CONECTORES_FO: [
        'Falla de conectores exterior (rotura-manipulación externa)',
        'Falla de conectores exterior (rotura-mal armado)',
        'Falla de conectores exterior (rotura-desgaste)',
        'Falla de conectores interior (rotura-manipulación externa)',
        'Falla de conectores interior (rotura-mal armado)',
        'Falla de conectores interior (rotura-desgaste)',
        'Fibra cortada en conector'
    ],
    MAIN_REASON_ONU_FO: [
        'Falla de ONU (por rotura-manipulación del cliente)',
        'Falla de ONU (por rotura- falla eléctrica o subida de tensión)',
        'Falla de ONU (problemas de velocidad)',
        'Falla de ONU (problemas de cobertura)',
        'Falla de ONU por desgaste de uso',
        'Falla puerto PON/GPON (atenuación)',
        'Falla en puertos LAN',
        'Onu desconfigurada'
    ],
    MAIN_REASON_ACOPLE_FO: [
        'Falla de conectores en acople (mal armado)',
        'Falla de conectores en acople (rotura-desgaste)',
        'Corte de drop acople (factor externo)'
    ],
    MAIN_REASON_PATCH_FO: [
        'Falla patch (por rotura- manipulación del cliente)'
    ],
    MAIN_REASON_ALIMENTACION_FO: [
        'Falla de trafo (por falla eléctrica)',
        'Falla de trafo (no corresponde modelo usado)'
    ],
    MAIN_SOLUTION_DROP_FO: [
        'Cambio de Drop completo',
        'Colocación de acople',
        'Utilización de ganancia',
        'Se corrige tensado de fibra',
        'Colocación de acople y cambio de drop parcial'
    ],
    MAIN_SOLUTION_CONECTORES_FO: [
        'Cambio de conector fuera del domicilio',
        'Cambio de conector dentro de la casa',
        'Se reutiliza conector que estaba fuera del domicilio',
        'Se reutiliza conector que estaba dentro de la casa'
    ],
    MAIN_SOLUTION_ONU_FO: [
        'Cambio de ONU',
        'Se configura sin reiniciar',
        'Se reinicia de fabrica y se configura'
    ],
    MAIN_SOLUTION_ACOPLE_FO: [
        'Cambio de conector en acople',
        'Cambio de drop parcial desde acople',
        'Cambio de acople - sin cambio de drop',
        'Cambio de acople - con cambio de drop parcial'
    ],
    MAIN_SOLUTION_PATCH_FO: [
        'Anulación de roseta'
    ],
    MAIN_SOLUTION_ALIMENTACION_FO: [
        'Cambio de trafo',
        'Cambio de trafo y ONU por estar quemados'
    ],
    ONU_TYPE_FO: [
        'ECHOLIFE HG8546M',
        'ECHOLIFE W85460HG',
        'HUAWEI ECHO LIFE HS8145V',
        'HUAWEI ECHO LIFE HS8546V',
        'HUAWEI ECHOLIFE HG8145V5-GPON',
        'HUAWEI ECHOLIFE HG8245H5',
        'HUAWEI ECHOLIFE HG8310M',
        'ONU DUAL BAND VSOL V2802DAC',
        'ONU FULL DOMUS FD-HG8100A',
        'ONU HUAWEI ECHOLIFE EG8141A5',
        'ONU I-CON IC410WSG',
        'ONU SINGLE BAND VSOL V2802GW',
        'ROUTER FIBRA -HS8545M',
        'ROUTER FIBRA -HS8546V',
        'ROUTER FIBRA -HS8546V2',
        'TX-6610',
        'XN020-G3v',
        'Otro'
    ]
}