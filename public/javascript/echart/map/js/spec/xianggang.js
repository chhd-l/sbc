(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports', 'echarts'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    factory(exports, require('echarts'));
  } else {
    // Browser globals
    factory({}, root.echarts);
  }
})(this, function (exports, echarts) {
  var log = function (msg) {
    if (typeof console !== 'undefined') {
      console && console.error && console.error(msg);
    }
  };

  if (!echarts) {
    log('ECharts is not Loaded');
    return;
  }
  if (!echarts.registerMap) {
    log('ECharts Map is not loaded');
    return;
  }
  echarts.registerMap('香港', {
    type: 'FeatureCollection',
    features: [
      {
        geometry: {
          coordinates: [
            ['@@D@bKBoCWKACBGCI@CJSVGFIBKCM@ABAF@LFHPFJJPFVB'],
            ['@@ABD@@AA@'],
            ['@@AAEAAB@DDBFC'],
            ['@@BMHBBGD@BAHBD@HKDEF@FHDEDECCGCIAAQWCUBSBDXApREHD'],
            [
              '@@rWAGBEJKRO@ACCBEAIAEGEACKPA@MDICIDOBKDGAIBIABRNDHFEHADEGE@CFGLC@GAABC@AHECABAN|TTI'
            ],
            [
              '@@JBJAHBLCPAJCJDPCLOJM@IBAFBBA@CE@AAE@AAFIBQBADAFECCBEA@GFCAYBABIRC@QEGEACBEHMACECQACFE`A@GCK@AFFHADMJBBF@BB@FBHCFI@KLEBCAGWAAQDGCGJQHOPOHS`KLN@LDJAHETUDIJ@HDxCZD'
            ],
            ['@@ACCBFB'],
            ['@@D@@ACCCB@CC@CFBDJA'],
            ['@@BA@AG@@B@BF@'],
            ['@@DABAGCADADBBDA'],
            ['@@BAEBD@'],
            ['@@AIBINQNIHU]IsRC@AvFBHFDCLDV@'],
            ['@@H[@EEGU@KCCDGEEABQi@AHCF@B^P@BABOFCFBFF@FDNADADHJDjB'],
            ['@@DEBEFC@CJKD@DCHDLDBMEG@CFCLICETSDQSJeMGVKHGJIR@HFJBFG^FDF@'],
            ['@@AC@IH_BAYCEDIAGDICGCCDC@IL@DEDAFCFNDVD@BADBBHCFDJA^D'],
            ['@@F@HWF@DABD@IHBB@GOAENMBE@AEAGOBCFE@CqXCRSTDFKJED@DFHANFCJBFCZD'],
            [
              '@@AEDQ@WQACIKIGCQCABAHC@]I@ADC@ECICCKEGA@NuASIHyO@IEQW@CÙF~bNJFL@D@FLBBNPJJFIDAHEDBDHBDDBBTCB@AHDB^@@JHHF@DDLFJFDBHCD@PPD@L@RLLBDHVBNAHBBABGhB'
            ],
            [
              '@@AC@G]@CABGA@SDAACCGAACFCBGJCIEOIAMKAEHGFgFgPS@E@MEGEEGCAO@E@SLUNCH@DDH@H@JEHAJCHQFAB\\`ZHTCFKBAHFFJFJBBZ@FC^CND@AEINGXA@OL@@U@@HN@BEE@@KTA@G'
            ],
            ['@@BAFADAAC@AACDACGEBBHAFGFBDD@'],
            ['@@B@B@@CA@AD'],
            ['@@BAB@CCA@ABDD'],
            ['@@D@CGABAFD@'],
            ['@@@ACICABJFD'],
            ['@@DA@ACCC@ADBFBBBC'],
            ['@@@A@@ABB@'],
            [
              '@@BMDIEK@CDCAMHG@C@MCG@YBAZHZDLIJA[gAGBEHMTO@EAIKAQKK@C@OOC@GDCAIEKECCE@EE@HSB@LF@AFM@@G@@VK@@PWBMHFJ@BMC]DEDY@AAEIEIGEABELSDVHNRJPHJLHXHFBP^ZVBRB@\\CJIDEH@DDAJHDFF@DGL@FFB^CRED@JFDPJHPBHED@HFFF'
            ],
            [
              '@@A@@HIEK@EA@BDH@BBBD@BBBAB@MN@DH@@BEFBDFBDA@C@@VABBDAJ@B@D@D@@CC@ECGB@ACACCA@IFEBAC@CFABEHGF@BACGGB'
            ],
            ['@@DC@CEDAFB@BA'],
            ['@@AABB'],
            ['@@@AC@DB'],
            ['@@AABB'],
            ['@@BAAAEABDDB'],
            ['@@@A@CEDBBD@'],
            ['@@@AABB@'],
            ['@@DA@CIE@JFB'],
            ['@@@@@@@@'],
            ['@@DCD@BNDBDIAE@I@EE@ABABOHAJDDFABC'],
            ['@@@A@B'],
            ['@@B@B@ECAFB@BA'],
            ['@@AA@BB@'],
            ['@@@@A@B@'],
            ['@@A@B@@@'],
            ['@@@A@B'],
            ['@@BCAB@B'],
            ['@@@A@B'],
            ['@@@FBCDBDABBBBBABCB@ABDBBDB@DH@JABBDNEBE@CD@FCKKG@AEC@EBA@ACIEA@EDBB@DB@ED'],
            ['@@A@B@'],
            ['@@D@BCG@ADBBBA'],
            ['@@@@@@'],
            ['@@BAAB'],
            ['@@A@B@'],
            ['@@@@AABB'],
            [
              '@@QCKMECAKH@FDD@FFDABAFBBHJBPZBDJ@BCD@BBHA@DF@HAAAEEDA@EF@DGF@BC@CGE@GFBLABBADBBDAH@D@@AEIBAFF@ADBDAGGAEA@EIBCLBBA@CDBBCHBBABCTKLFZHRJH@DASMQGGIOEGAGBaNM@eEK@EDKLGBCFEBAAAGGGEEEIIGAEIDU@GBK@IDUAIAEEEGCIEBEAAHM@AABC@EKCWOMEIBKJYCYGAB@ZDH@N@DGHBNCFFNEN@JBFMJBDNDFHFBHEDALDFAFD@KFAFDBFH@FHDBF@DFHAHDLABAFBBDFF@BAAA@@D@DD@@HH@LLDCJFFCJ@BABEFABBJAB@DADDH@BBB@FBDCPBFEJBFC@AFADC@IDA'
            ],
            ['@@HGNA@ACGC@G@OFADCL@FDDJDBA@M'],
            [
              '@@@EACUMIMGGGCE@@CACIEMCMISGG@CESIGKGEQGG@CBABALQTCDABC@GCK@EBCACAAKBAHABAB@HA@AE@@ENADBDLFBFABACGEEICG@ICQB@B@J@@GBAAEEAODERKMIGMAAUAAAUA@ACAAA[ASAAHABGAMBUAAA@D@FSPIRBJ\\hNFXPLD@FADBBN@BGFBFAHPDFHD\\BJCL@HAV@JCBFJHFJFFHHBHDBHGHALKFCL@fFN@bMLATHHJRHTN'
            ],
            ['@@CIEAEJBBBDBBBBHAFBEG'],
            ['@@@CFABAAGCC@ECCEACB@HAJAB@FEDJJDBHABA@CAC'],
            ['@@BAEBBBBA'],
            [
              '@@^DLCFBBBBJFJNLH@DHN@NXJFFHPHDABABKDAFDDABGAEBCDBFFALDDBFDBDADIBIFOCCICAAAI@CDG@KJ@HEBBDJCBALDBFBBBDB@HBHHALEDE@IEG@EGA@EDIBYEGAIEEICADMFOLA@KEE@OHKHYDAC@KCECAS@CCAEBGGOK@CACIYCEAGEBLCH@JGJ@FBXCHDL@P'
            ],
            ['@@AEA@ABB@@FB@BA'],
            ['@@@CABBB'],
            ['@@BAAAABBB'],
            ['@@BACDBA'],
            ['@@@A@B'],
            ['@@@DHBAEC@A@'],
            ['@@AA@BB@'],
            ['@@BB@CAA@D'],
            ['@@B@@@C@BB@A'],
            [
              '@@FIJBFCF@JDF@DDBEDBDEHACGDK@EFEFK@EGAI@CDILEBEAIG@C@EECCKBCJEFGFAJGAGDKEGDG@GCCC@CBCFC@AIGAACFEEACC@CEAGB@EC@@AID@KBC@CACCGE@ABALGLBFA@GGEAE@GJAFBFIFCJHN@JOFGFG@@DBHABCFKAAEDCACI@GBGAAFI@GJEBE@ECAEBICCCU@KJI@IGKIBAAHcDEFENAFADE@CDGDET@BCBEJGDKAIKEEEGAACBCF@DA@MHI@CACCAE@AGE@OLEHGBAA@CECCGEAEBITGDANHRGLCDG@QSEG@DEDADHPFB@BEJIJBFHPA@GA@JACCBEBGVE@ABG`@JBDB@ADBFPBPJLLBJRDAJHFFBZDFLN@HPAHBFDDT@DBDF@LBDZCLGPGF@LFB@PKNEBCJDFFBJFHAZCJ@FHB'
            ],
            ['@@A@@@B@'],
            ['@@@@@@'],
            ['@@AABB'],
            ['@@BAC@@DBA'],
            ['@@BAA@ABB@'],
            ['@@@AABB@'],
            ['@@@AABB@'],
            ['@@B@BACEC@@DDD'],
            ['@@A@B@'],
            ['@@@AADBA'],
            ['@@DC@CA@ADA@ADD@'],
            [
              '@@DBFADBLC@MDEBIA@@GJAHGCCBEAA@CCA@CAEKBEBGACBEDEJAFHHAB@LABBDA@@AA@CBBB@DD@@DCDCB@JBBHA'
            ],
            ['@@@AAAAD@@D@'],
            ['@@@A@B@@'],
            ['@@HE@C@ICAA@AHAHCEEFBF@BD@FA'],
            ['@@BACA@CC@@DFD'],

            ['@@@AA@BB'],
            ['@@BCFE@ACCDQCACB@FCBCLGHFFBHFDB@DE@AEBBE'],
            ['@@@ACAAFFA'],
            ['@@BA@@CBB@'],
            ['@@B@C@BB@A'],
            ['@@@AABB@'],
            ['@@@AA@@DBB@C'],
            ['@@ACABDB'],
            ['@@BAAB'],
            ['@@@@@@'],
            ['@@BACA@BBB'],
            ['@@A@BB@A'],
            ['@@FADIFEAICAACC@ABI@CFBDCD@BCHFFLB'],
            ['@@CEBEBACA@AA@KD@JBHH@@BF@BE'],
            ['@@@@A@B@'],
            ['@@@CE@BFB@BA'],
            ['@@AB@FDC@AAA'],
            ['@@DHFEDAFGACBCMBEJ@D'],
            ['@@BADABAB@BCKBCFDB'],
            ['@@B@B@C@'],
            ['@@A@@BB@@A'],
            ['@@D@C@@@'],
            ['@@BAAB'],
            ['@@@AA@BB'],
            ['@@BAAB@@'],
            ['@@@AADBA'],
            ['@@@@@@'],
            ['@@@A@B'],
            ['@@AA@DBA'],
            ['@@@A@B'],
            ['@@@A@B'],
            ['@@@AABB@'],

            ['@@BAEBBBBA'],
            ['@@@@@@'],
            ['@@A@B@'],
            ['@@BC@AAAEDBDD@'],
            ['@@B@@AAB'],
            ['@@BACKAAC@@JDDBBB@'],
            ['@@AA@B@@B@'],
            ['@@BCA@@D'],
            ['@@@@@@'],
            ['@@@A@B'],
            ['@@@EAABAE@AAA@@JF@@FBBBA@C'],
            ['@@@CCB@BD@'],
            ['@@AA@GAAEAAE@@E@AJFLDDFADFF@@EEC'],

            ['@@AFDBJBAADCDEACFEGA@EEB@FEDAH'],
            ['@@JDB@ACDC@AA@ACB@@ADA@EC@@EAEC@E@AECAABBFIBED@F@DFHFDDAFF'],
            [
              '@@PGJAVDFD@HDBJBPA@OCKDGAYHM@IDGAKBIQCAIKKOIMACEBC_CIBECGDAABC@AUCKCG@ICeAICAAGHAL@FFJCP@FDHADLBFDLJDJRB@XCRBFHBBBDB@BVBBBXBHPNJ'
            ],
            [
              '@@AECBMBECGA@CDEPEBA]QDGBGj@@cUADF@F@DCFIFSJQTQBaASPEBGzTJvB@MHBLFDDDJ@FCD@@ZJHBBIJBBCCI@GDKEI@EBKHG'
            ],
            [
              '@@AIIGQCQ@GE@G@ICCGAAABCBA@GBGCA@ADOAGO@KBMLC@ACAEFARSDEACSGCEACLIL@DEPCBACEAECCE@AACEIECCKCMGI@KJGJEJ@FDLIBSGUAOOSEAABE@ECG_CSBUPAHGBICEOUMGCKBC@GCGGMCABDRGDAF@HBFEHAP@JJJH@BNRFDDBHEBICAH@DPHF@DAFFFNLBRFBHNNBD@HEJJVED@DBDZD@DEPFBAFCBAI[@CFGF@~dÚE'
            ],
            ['@@DC@AKE@ABADDF@BCFCAAIEG@CBAB@DABAFGDBBXF'],
            ['@@BAAAC@ADDBBA'],
            ['@@BCAAIBA@BDBDJB@CAA'],
            ['@@BCCGGCGBABBHFDL@'],
            ['@@J@FC@AAKFGCIC@EDADAD@B@BCBAAEHI@AF@BB@@DT@'],

            [
              '@@CEMI@ABEHHFBHBHAFDFBF@BCLBDC@AGIK@OMDKJM@CAAC@YP@AHKAGAACBGHEGC@GBMDCD@HBDFDDDBXCFBNAHEBA@@IEAGCK@CNBDLHHD@BEBDFGD@DVJBBBBBCF@BECGACLGBEAADEDADFF@DE@E'
            ],
            ['@@@CEA@DDDBA'],
            [
              '@@FEFBD@DEC@@CCAACGF@AE@CCBAC@CCCCCBBBG@AHH@DHH@DFADABE@CD@BD@DF@BABBDDBH@DBDB@E@AEAFABAKCAA@EDA'
            ],
            ['@@D@ACAACD@B@BDA'],
            ['@@BAC@BB'],
            ['@@B@BBBA@EACGAEFA@GDBHJJFA@CB@BCAA@C'],
            ['@@D@BCBEAECCGC@BIB@CAA@FA@@PTD'],
            ['@@DE@KG@CBAHBDDABFB@'],

            ['@@BB@CAB'],
            ['@@BHBB@CAEA@'],
            ['@@BADBDABAD@BAAABAAAABABAA@CA@ADAAAB@DABCACCC@BRHCBC'],
            ['@@@A@ACA@DDB'],
            ['@@DAAC@@CD@BB@'],
            ['@@ABBA'],
            ['@@BAC@BB'],

            ['@@AAA@BDBA'],
            ['@@A@B@'],
            ['@@BBBAAAABCAA@FB'],
            ['@@@BD@DDCDBDDBDAB@FCAAE@@EBABEE@CAI@AACAGF@DFDF@DA'],
            ['@@@A@A@D'],
            ['@@BACA@BBB'],
            ['@@B@@AEABBBB'],
            ['@@DFPFBFF@BCFCFICCDEBIQA@DA@EC@ECCEAE@FJIBABD@@DCAABBJDF']
          ],
          encodeOffsets: [
            [[116895, 22829]],
            [[116861, 22818]],
            [[116860, 22817]],
            [[116927, 22822]],
            [[116967, 22827]],

            [[116946, 22787]],
            [[116886, 22776]],
            [[116934, 22767]],
            [[117006, 22758]],
            [[116932, 22748]],
            [[116970, 22738]],
            [[116920, 22860]],
            [[116919, 22881]],
            [[116925, 22883]],
            [[116970, 22892]],
            [[116974, 22868]],
            [[116914, 22950]],
            [[116810, 22924]],
            [[116618, 22917]],
            [[116612, 22891]],

            [[116626, 22888]],
            [[116629, 22880]],
            [[116725, 22874]],
            [[116708, 22866]],
            [[116720, 22861]],
            [[116828, 23059]],
            [[117049, 23071]],
            [[117017, 23092]],
            [[117013, 23092]],
            [[117010, 23091]],
            [[117004, 23090]],
            [[117009, 23086]],
            [[117081, 23081]],
            [[117014, 23081]],
            [[117057, 23081]],
            [[117015, 23077]],

            [[117062, 23071]],
            [[117020, 23075]],
            [[117024, 23072]],
            [[117021, 23072]],
            [[117029, 23071]],
            [[117037, 23071]],
            [[116974, 23071]],
            [[116957, 23067]],
            [[117036, 23065]],
            [[117043, 23049]],
            [[117033, 23064]],
            [[117035, 23059]],

            [[117043, 23052]],
            [[117049, 23053]],
            [[117040, 23048]],
            [[117054, 23039]],
            [[116975, 23082]],
            [[117183, 23086]],
            [[117087, 23049]],
            [[117113, 23039]],
            [[117114, 23018]],
            [[117122, 23021]],
            [[116998, 22974]],
            [[117082, 23017]],
            [[117084, 23018]],
            [[117081, 23013]],
            [[117180, 23003]],

            [[117039, 23001]],
            [[116966, 22997]],
            [[117006, 22983]],
            [[116968, 22976]],
            [[117146, 22985]],
            [[117119, 22980]],
            [[117154, 22972]],
            [[117153, 22970]],
            [[117139, 22942]],
            [[117137, 22939]],
            [[117137, 22938]],
            [[117033, 22925]],
            [[117063, 22925]],
            [[117066, 22923]],
            [[117031, 22921]],
            [[117064, 22919]],
            [[117029, 22917]],
            [[117054, 22915]],
            [[117038, 22915]],

            [[117048, 22915]],
            [[117075, 22911]],
            [[117036, 22912]],
            [[117039, 22911]],
            [[117043, 22905]],
            [[117051, 22909]],
            [[117044, 22906]],
            [[117050, 22906]],
            [[117074, 22902]],
            [[117143, 22898]],
            [[117036, 22899]],
            [[117076, 22898]],
            [[117116, 22882]],
            [[117120, 22880]],
            [[117102, 22876]],
            [[117073, 22876]],
            
            [[117119, 22871]],
            [[117126, 22873]],
            [[117085, 22870]],
            [[117121, 22865]],
            [[117041, 22863]],
            [[117123, 22866]],
            [[117118, 22860]],
            [[117118, 22859]],
            [[117118, 22859]],
            [[117069, 22860]],
            [[117077, 22857]],
            [[117116, 22856]],
            [[117068, 22845]],
            [[117059, 22840]],
            [[117059, 22838]],
            [[117061, 22837]],
            [[117066, 22837]],
            [[117066, 22837]],
            [[117061, 22835]],
            [[117070, 22834]],
            [[117061, 22834]],
            [[117068, 22833]],
            [[117064, 22810]],
            [[117100, 22804]],
            [[117100, 22803]],
            [[117118, 22799]],
            [[117120, 22799]],
            [[117028, 22798]],
            [[117095, 22795]],
            [[117103, 22791]],
            [[117097, 22787]],
            [[117105, 22856]],
            [[117111, 22850]],
            [[117039, 22789]],
            [[116956, 22970]],
            [[116892, 22877]],
            [[116799, 22849]],
            [[116787, 22826]],
            [[116803, 22822]],
            [[116823, 22817]],
            [[116799, 22797]],
            [[116780, 22791]],
            [[116882, 22747]],
            [[116881, 22757]],
            [[116774, 22741]],
            [[116575, 22748]],
            [[116686, 22746]],
            [[116733, 22725]],
            [[117001, 22721]],
            [[117036, 22720]],
            [[117038, 22719]],
            [[117053, 22714]],
            [[116651, 22714]],
            [[117053, 22714]],
            [[116664, 22710]],
            [[116665, 22706]],
            [[116984, 22706]],
            [[116645, 22704]],
            [[116647, 22703]],
            [[116640, 22702]],
            
            [[116646, 22692]],
            [[116656, 22693]],
            [[116663, 22685]],
            [[116998, 22691]],
            [[117001, 22702]]
          ],
          type: 'MultiPolygon'
        },
        id: '810000',
        properties: {
          childNum: 1,
          cp: [114.195126, 22.379715],
          name: '香港特别行政区'
        },
        type: 'Feature'
      }
    ],
    UTF8Encoding: true
  });
});
