export default {
  mainMenu: {
    new: 'Yeni Çizim',
    open: 'Çizim Aç',
    drawingUnits: 'Çizim Birimleri',
    exportMenu: 'Dışa Aktar',
    export: 'DXF\'e Dışa Aktar',
    exportHtml: 'HTML\'e Dışa Aktar',
    exportPdf: 'PDF\'e Dışa Aktar',
    exportSvg: 'SVG\'e Dışa Aktar',
    exportAs: '{format} olarak dışa aktar',
    exportImage: 'Görüntüye Dışa Aktar',
    exportImageArea: 'Seçili alanı görüntü olarak dışa aktar',
    settings: 'Ayarlar',
    about: 'Hakkında'
  },
  ribbon: {
    tab: {
      home: 'Ana Sayfa',
      insert: 'Ekle',
      review: 'İnceleme',
      measurement: 'Ölçüm',
      hatchContext: 'Desen dolgusu',
      mtextEditorContext: 'Metin Düzenleyici'
    },
    hatch: {
      group: {
        boundary: 'Sınırlar',
        pattern: 'Desen',
        properties: 'Özellikler',
        options: 'Seçenekler',
        close: 'Kapat'
      },
      command: {
        pickPoints: 'Nokta Seç',
        selectObjects: 'Nesne Seç',
        close: 'Kapat'
      },
      field: {
        pattern: 'Desen',
        scale: 'Ölçek',
        angle: 'Açı',
        style: 'Stil',
        associative: 'İlişkisel',
        fillType: 'Dolgu Türü',
        fillColor: 'Renk',
        patternColor: 'Desen Rengi',
        gradient1Color: 'Geçiş Rengi 1',
        backgroundColor: 'Arka Plan Rengi',
        gradient2Color: 'Geçiş Rengi 2',
        opacity: 'Saydamlık',
        gapTolerance: 'Boşluk',
        imageScale: 'Görüntü Ölçeği'
      },
      style: {
        normal: 'Normal',
        outer: 'Dış',
        ignore: 'Yoksay'
      },
      fillType: {
        solid: 'Düz',
        pattern: 'Desen',
        gradient: 'Geçiş'
      },
      associative: {
        on: 'Açık',
        off: 'Kapalı'
      },
      tooltip: {
        pickPoints: 'Desen dolgusu bölgeleri oluşturmak için iç noktalar seçin.',
        selectObjects: 'Doldurulacak alanı çevreleyen nesneleri seçin (kapalı nesneler veya birlikte kapanan çizgiler).',
        pattern: 'Dolgu deseni adını seçin.',
        scale:
          'Dolgu deseninin boyutunu (ölçek) ayarlayın. Çizim açıldığında pafta ölçeğine ayarlanır (1:100 için 100).',
        angle: 'Dolgu deseni açısını derece cinsinden ayarlayın.',
        style: 'Desen dolgusu oluşturma için ada tespit stilini kontrol edin.',
        associative: 'İlişkisel desen dolgusu modunu aç/kapat.',
        fillType: 'Dolgu türünü seçin: düz, desen veya geçiş.',
        fillColor: 'Dolgu rengini seçin.',
        patternColor: 'Desen çizgi rengini seçin.',
        gradient1Color: 'İlk geçiş rengini seçin.',
        backgroundColor: 'Desen dolgusu için arka plan rengini seçin.',
        gradient2Color: 'İkinci geçiş rengini seçin.',
        opacity: 'Desen dolgusu saydamlığını ayarlayın (0-90).',
        gapTolerance: 'Eğri uçları arasındaki bu genişliğe (çizim birimi) kadar boşluklar yine kapalı sınır sayılır (HPGAPTOL, 0–5000).',
        imageScale: 'Dolgu görüntüsü ölçeğini ayarlayın.',
        close: 'Desen dolgusu oluşturmadan çıkın ve bu bağlamsal sekmeyi kapatın.'
      }
    },
    mtext: {
      group: {
        textStyle: 'Metin Stili',
        format: 'Biçim',
        paragraph: 'Paragraf',
        insert: 'Ekle',
        close: 'Kapat'
      },
      field: {
        textStyle: 'Metin Stili',
        font: 'Yazı Tipi',
        color: 'Renk',
        height: 'Yükseklik',
        obliqueAngle: 'Eğim açısı',
        tracking: 'Karakter Aralığı',
        widthFactor: 'Genişlik faktörü'
      },
      characterMap: {
        title: 'Karakter Eşlemi',
        font: 'Yazı Tipi(F):',
        charsToCopy: 'Kopyalanacak karakterler(A):',
        select: 'Seç(S)',
        copy: 'Kopyala(C)',
        noGlyphs: 'Bu yazı tipi için kullanılabilir karakter yok.',
        copyFailed: 'Panoya kopyalanamadı.'
      },
      command: {
        bold: 'Kalın',
        underline: 'Altı Çizili',
        superscript: 'Üst Simge',
        italic: 'İtalik',
        overline: 'Üstü Çizili',
        subscript: 'Alt Simge',
        strikethrough: 'Üstü Çizili (Silme)',
        stack: 'Yığın',
        toggleCase: 'Büyük/Küçük Harf',
        attachment: 'Hizalama',
        list: 'Madde İşaretleri ve Numaralandırma',
        lineSpacing: 'Satır Aralığı',
        paragraphAlignment: 'Paragraf Hizalaması',
        symbol: 'Sembol',
        close: 'Kapat'
      },
      tooltip: {
        textStyle: 'Geçerli çizimden bir metin stili seçin.',
        bold: 'Kalın biçimlendirmeyi aç/kapat.',
        underline: 'Altı çizili biçimlendirmeyi aç/kapat.',
        superscript: 'Üst simge biçimlendirmeyi aç/kapat.',
        italic: 'İtalik biçimlendirmeyi aç/kapat.',
        overline: 'Üstü çizili biçimlendirmeyi aç/kapat.',
        subscript: 'Alt simge biçimlendirmeyi aç/kapat.',
        strikethrough: 'Üstü çizili (silme) biçimlendirmeyi aç/kapat.',
        stack: 'Seçili kesir metnini yığınla veya ayır.',
        toggleCase: 'Seçili metni büyük ve küçük harf arasında değiştirin.',
        font: 'Geçerli metin yazı tipini ayarlayın.',
        color: 'Geçerli metin rengini ayarlayın.',
        height:
          'Geçerli metin yüksekliğini ayarlayın. Özel değerlere izin verilir.',
        obliqueAngle:
          'Seçili karakterler için eğim açısını derece cinsinden ayarlayın (negatif değer diğer yöne eğer).',
        tracking:
          'Seçili karakterler arasındaki boşluğu artırın veya azaltın (varsayılan 1\'dir).',
        widthFactor:
          'Seçili karakterleri yatay olarak genişletin veya sıkıştırın (varsayılan 1\'dir).',
        attachment: 'Çok satırlı metin bağlantı noktasını ayarlayın.',
        list: 'Madde işaretleri ve numaralandırma ekleyin veya yapılandırın.',
        lineSpacing: 'Satır aralığını ayarlayın.',
        paragraphAlignment: 'Paragraf yatay hizalamasını ayarlayın.',
        symbol: 'Ortak bir çizim sembolü ekleyin.',
        close: 'Metin düzenleyicisini ve bu bağlamsal sekmeyi kapatın.'
      },
      attachment: {
        TL: 'Sol Üst TL',
        TC: 'Orta Üst TC',
        TR: 'Sağ Üst TR',
        ML: 'Sol Orta ML',
        MC: 'Orta Orta MC',
        MR: 'Sağ Orta MR',
        BL: 'Sol Alt BL',
        BC: 'Orta Alt BC',
        BR: 'Sağ Alt BR'
      },
      list: {
        off: 'Kapalı',
        number: 'Numaralı',
        letter: 'Harfli',
        bullet: 'Madde İşaretli',
        start: 'Başlat',
        continue: 'Devam Et',
        auto: 'Otomatik Madde İşareti ve Numaralandırmaya İzin Ver',
        allowList: 'Madde İşaretleri ve Listelere İzin Ver'
      },
      lineSpacing: {
        more: 'Daha Fazla...',
        clear: 'Paragraf Aralığını Temizle'
      },
      paragraphAlign: {
        default: 'Varsayılan',
        left: 'Sol',
        center: 'Orta',
        right: 'Sağ',
        justified: 'İki Yana Yaslı',
        distributed: 'Dağıtılmış'
      },
      symbol: {
        degree: 'Derece  %%d',
        plusMinus: 'Artı/Eksi  %%p',
        diameter: 'Çap  %%c',
        almostEqual: 'Yaklaşık Eşit  \\U+2248',
        angle: 'Açı  \\U+2220',
        boundary: 'Sınır Çizgisi  \\U+E100',
        centerLine: 'Merkez Çizgisi  \\U+2104',
        delta: 'Delta  \\U+0394',
        electricalPhase: 'Elektrik Fazı  \\U+0278',
        flowLine: 'Akış Çizgisi  \\U+E101',
        identical: 'Özdeş  \\U+2261',
        notEqual: 'Eşit Değil  \\U+2260',
        ohm: 'Ohm  \\U+2126',
        omega: 'Omega  \\U+03A9',
        propertyLine: 'Mülkiyet Sınırı  \\U+214A',
        subscriptTwo: 'Alt Simge 2  \\U+2082',
        squared: 'Kare  \\U+00B2',
        cubed: 'Küp  \\U+00B3',
        nbsp: 'Bölünemez Boşluk Ctrl+Shift+Space',
        other: 'Diğer...'
      }
    },
    group: {
      draw: 'Çiz',
      modify: 'Düzenle',
      layer: 'Katman',
      properties: 'Özellikler',
      utilities: 'Yardımcı Araçlar',
      annotation: 'Açıklama',
      review: 'İnceleme',
      measurement: 'Ölçüm',
      style: 'Stil',
      lengthUnits: 'Uzunluk Birimleri',
      angleUnits: 'Açı Birimleri',
      reference: 'Referans',
      block: 'Sembol'
    },
    insertBlock: {
      empty: 'Kullanılabilir sembol yok',
      currentDrawing: 'Geçerli Çizim',
      previewMenu: 'Sembol önizleme galerisi'
    },
    property: {
      color: 'Renk',
      lineColor: 'Çizgi rengi',
      lineType: 'Çizgi Türü',
      lineWeight: 'Çizgi Kalınlığı'
    },
    layerTools: {
      select: 'Katman',
      off: 'Katmanı Kapat',
      isolate: 'İzole Et',
      lock: 'Katmanı Kilitle',
      current: 'Geçerli Yap',
      allOn: 'Katmanı Aç',
      unisolate: 'İzolasyonu Kaldır',
      unlock: 'Katman Kilidini Aç',
      restore: 'Katmanı Geri Yükle'
    },
    arc: {
      threePoint: '3 Nokta',
      startCenterEnd: 'Başlangıç, Merkez, Bitiş',
      startCenterAngle: 'Başlangıç, Merkez, Açı',
      startCenterLength: 'Başlangıç, Merkez, Uzunluk',
      startEndAngle: 'Başlangıç, Bitiş, Açı',
      startEndDirection: 'Başlangıç, Bitiş, Yön',
      startEndRadius: 'Başlangıç, Bitiş, Yarıçap',
      centerStartEnd: 'Merkez, Başlangıç, Bitiş',
      centerStartAngle: 'Merkez, Başlangıç, Açı',
      centerStartLength: 'Merkez, Başlangıç, Uzunluk'
    },
    circle: {
      centerRadius: 'Merkez, Yarıçap',
      centerDiameter: 'Merkez, Çap',
      twoPoint: '2 Nokta',
      threePoint: '3 Nokta',
      tanTanRadius: 'Teğet, Teğet, Yarıçap',
      tanTanTan: 'Teğet, Teğet, Teğet'
    },
    ellipse: {
      ellipse: 'Elips',
      arc: 'Eliptik Yay'
    },
    tooltip: {
      line: 'Tek bir düz çizgi parçası çizin.',
      polyline:
        'Bağlı bir dizi çizgi veya yay parçasını tek bir nesne olarak çizin.',
      spline:
        'Uyum veya kontrol noktaları üzerinden düzgün bir spline eğrisi çizin.',
      sketch: 'Bir dizi serbest el çizgi parçası oluşturun.',
      revcloud:
        'Çizim alanlarını vurgulamak için bir revizyon bulutu oluşturun.',
      circle: 'Birden fazla oluşturma yöntemiyle bir daire çizin.',
      arc: 'Birden fazla oluşturma yöntemiyle bir yay çizin.',
      mline:
        'Birden fazla paralel çizgiyi tek bir çoklu çizgi nesnesi olarak çizin.',
      ray: 'Bir başlangıç noktasından yarı sonsuz bir yardımcı ışın çizin.',
      xline: 'Sonsuz bir yardımcı çizgi çizin.',
      ellipse: 'Bir elips veya eliptik yay çizin.',
      rect: 'Bir dikdörtgen veya düzgün çokgen çizin.',
      point: 'Çizime bir nokta nesnesi yerleştirin.',
      hatch: 'Kapalı bir alanı bir desenle doldurun (tarama).',
      text: 'Çizimde çok satırlı metin açıklamaları oluşturun.',
      move: 'Seçili nesneleri yeni bir konuma taşıyın.',
      rotate: 'Seçili nesneleri bir taban noktası etrafında döndürün.',
      copy: 'Seçili nesneleri yeni bir konuma kopyalayın.',
      erase: 'Seçili nesneleri çizimden silin.',
      offset:
        'Bir nesnenin belirtilen mesafede paralel bir kopyasını oluşturun.',
      undo: 'Son düzenleme işlemini geri alın.',
      redo: 'Son geri alınan düzenleme işlemini yineleyin.',
      properties: 'Geçerli seçim için Özellikler panelini açın.',
      quickSelect:
        'Nesneleri tür, katman ve diğer ölçütlere göre filtrelemek ve seçmek için Ölçüte Göre Seç (Hızlı Seçim) panelini açın.',
      find: 'Tüm çizimde veya geçerli baskı sayfasında metin aramak için Bul paletini açın.',
      countList:
        'Sembol (blok) sayılarını görüntülemek ve yönetmek için Sayım paletini açın.',
      missingResources:
        'Yazı tipleri, görseller ve bağlantılı çizimler (xref) için Eksik / Harici Kaynaklar paletini açın.',
      drawingUnits:
        'Koordinat biçimlerini, hassasiyeti ve ekleme ölçeğini ayarlamak için Çizim Birimlerini açın.',
      attachDwg:
        'Bir DWG veya DXF çizimini bağlantılı çizim (harici referans) olarak ekleyin (XATTACH).',
      attachImage:
        'Bir raster görüntüyü bağlantı olarak ekleyin (IMAGEATTACH).',
      insert:
        'Sembol tanımlarına göz atmak ve eklemek için Semboller (bloklar) paletini açın (INSERT).',
      editAttributes:
        'Sembol özelliklerinin (blok öznitelikleri) değerlerini ve görüntü ayarlarını düzenleyin (ATTEDIT).',
      defineAttribute:
        'Bir sembolde kullanılacak bir özellik (öznitelik tanımı) oluşturun (ATTDEF).',
      agent:
        'Doğal dil kullanarak geometri çizmek için CAD Ajanı panel sekmesini açın.',
      propertyColor:
        'Yeni oluşturulan nesneler veya seçili varlıklar için rengi ayarlayın.',
      propertyLineType:
        'Yeni oluşturulan nesneler veya seçili varlıklar için çizgi türünü (çizgi tipi) ayarlayın.',
      propertyLineWeight:
        'Yeni oluşturulan nesneler veya seçili varlıklar için çizgi kalınlığını ayarlayın.',
      layerAction: {
        off: 'Seçili katmanı kapatarak nesnelerini gizler.',
        isolate:
          'Yalnızca seçili katmanı gösterir ve diğerlerini gizleyerek ilgili nesnelere odaklanmanızı sağlar.',
        lock: 'Seçili katmanı kilitleyerek nesnelerinin görünür kalmasını ancak düzenlenememesini sağlar.',
        current:
          'Seçili katmanı geçerli yaparak yeni nesnelerin o katmanda oluşturulmasını sağlar.',
        allOn: 'Gizlenmiş tüm katmanları gösterir.',
        unisolate:
          'Katman İzole tarafından gizlenen veya kilitlenen katmanları, sonraki katman değişikliklerini koruyarak geri yükler.',
        unlock:
          'Seçili katmanın kilidini açarak nesnelerinin tekrar seçilip değiştirilebilmesini sağlar.',
        restore:
          'Bu şeritteki en son katman işleminden önceki katman durumunu geri yükler.'
      },
      circleOption: {
        centerRadius: 'Bir merkez nokta ve yarıçap belirterek daire oluşturun.',
        centerDiameter: 'Bir merkez nokta ve çap belirterek daire oluşturun.',
        twoPoint: 'Çapı iki nokta ile tanımlanan bir daire oluşturun.',
        threePoint: 'Üç noktadan geçen bir daire oluşturun.',
        tanTanRadius:
          'Belirtilen yarıçapla iki nesneye teğet bir daire oluşturun.',
        tanTanTan: 'Üç nesneye teğet bir daire oluşturun.'
      },
      arcOption: {
        threePoint:
          'Bir başlangıç noktası, ikinci bir nokta ve bir bitiş noktasından geçen bir yay oluşturun.',
        startCenterEnd:
          'Bir başlangıç noktası, merkez nokta ve bitiş noktası belirterek yay oluşturun.',
        startCenterAngle:
          'Bir başlangıç noktası, merkez nokta ve dahili açı kullanarak yay oluşturun.',
        startCenterLength:
          'Bir başlangıç noktası, merkez nokta ve yay uzunluğu kullanarak yay oluşturun.',
        startEndAngle:
          'Dahili açıyla başlangıç ve bitiş noktalarından yay oluşturun.',
        startEndDirection:
          'Başlangıç noktasında teğet yönle başlangıç ve bitiş noktalarından yay oluşturun.',
        startEndRadius:
          'Belirtilen yarıçapla başlangıç ve bitiş noktalarından yay oluşturun.',
        centerStartEnd:
          'Bir merkez nokta, başlangıç noktası ve bitiş noktası belirterek yay oluşturun.',
        centerStartAngle:
          'Bir merkez nokta, başlangıç noktası ve dahili açı belirterek yay oluşturun.',
        centerStartLength:
          'Bir merkez nokta, başlangıç noktası ve yay uzunluğu belirterek yay oluşturun.'
      },
      rectOption: {
        rectangle:
          'Karşılıklı köşeler veya boyutlar belirterek dikdörtgen oluşturun.',
        polygon:
          'Kenar sayısı ve oluşturma yöntemi belirterek düzgün çokgen oluşturun.'
      },
      ellipseOption: {
        ellipse: 'Büyük ve küçük eksenleri belirterek tam bir elips oluşturun.',
        arc: 'Elips eksenlerini ve yay sınırlarını belirterek eliptik yay oluşturun.'
      }
    },
    command: {
      line: 'Çizgi',
      polyline: 'Çoklu Çizgi',
      circle: 'Daire',
      arc: 'Yay',
      mline: 'Çoklu Çizgi (MLine)',
      ray: 'Işın',
      xline: 'Sonsuz Çizgi',
      ellipse: 'Elips',
      spline: 'Spline',
      sketch: 'Eskiz',
      revcloud: 'Revizyon Bulutu',
      rect: 'Dikdörtgen',
      rectangle: 'Dikdörtgen',
      polygon: 'Çokgen',
      point: 'Nokta',
      divide: 'Böl',
      hatch: 'Desen\ndolgusu',
      text: 'Metin',
      gradient: 'Geçiş',
      move: 'Taşı',
      rotate: 'Döndür',
      copy: 'Kopyala',
      erase: 'Sil',
      offset: 'Ötele',
      undo: 'Geri Al',
      redo: 'Yinele',
      properties: 'Özellikler',
      quickSelect: 'Ölçüte\nGöre Seç',
      find: 'Bul',
      countList: 'Sayım',
      drawingUnits: 'Çizim\nBirimleri',
      attachDwg: 'DWG\nEkle',
      attachImage: 'Görüntü\nEkle',
      insert: 'Ekle',
      editAttributes: 'Özellikleri\nDüzenle',
      defineAttribute: 'Özellik\nTanımla',
      agent: 'CAD\nAjanı'
    }
  },
  verticalToolbar: {
    chrome: {
      collapse: 'Araç çubuğunu daralt',
      expand: 'Araç çubuğunu genişlet',
      moreOverflow: 'Diğer araçlar',
      move: 'Taşımak için sürükleyin (sıfırlamak için çift tıklayın)',
      layoutMenu: 'Araç çubuğu yerleşimi',
      vertical: 'Dikey',
      horizontal: 'Yatay',
      resetPosition: 'Konumu sıfırla'
    },
    measure: {
      text: 'Ölç',
      description: 'Ölçüm araçları'
    },
    measureDistance: {
      text: 'Mesafe',
      description: 'İki nokta arasındaki mesafeyi ölçer'
    },
    measureContinuous: {
      text: 'Sürekli',
      description:
        'Enter veya İptal edilene kadar ardışık noktalar seçerek zincirleme mesafeleri ölçer'
    },
    measureAngle: {
      text: 'Açı',
      description: 'Ortak bir köşeyi paylaşan iki çizgi arasındaki açıyı ölçer'
    },
    measureArea: {
      text: 'Alan',
      description: 'Bir çokgenin alanını ölçer'
    },
    measureArc: {
      text: 'Yay',
      description: 'Üç nokta ile tanımlanan bir yayın uzunluğunu ölçer'
    },
    measurePoint: {
      text: 'Nokta',
      description: 'Seçilen noktanın X/Y koordinatlarını ölçer'
    },
    measurementPanel: {
      text: 'Ölçüm paneli',
      description: 'Ölçüm paletini açar'
    },
    clearMeasurements: {
      text: 'Temizle',
      description: 'Geçerli baskı sayfasındaki tüm ölçümleri kaldırır'
    },
    measurementImport: {
      text: 'İçe Aktar',
      description: 'Ölçümleri sidecar JSON dosyasından içe aktarır'
    },
    measurementExport: {
      text: 'Dışa Aktar',
      description: 'Ölçümleri sidecar JSON dosyasına dışa aktarır'
    },
    annotation: {
      text: 'İnceleme',
      description: 'İnceleme araçları'
    },
    layer: {
      text: 'Katman',
      description: 'Katmanları yönetir'
    },
    text: {
      text: 'Metin (MText)',
      description: 'Çizimde çok satırlı bir metin notu oluşturur'
    },
    pan: {
      text: 'Kaydır',
      description:
        'Görüntüleme yönünü veya büyütmeyi değiştirmeden görünümü kaydırır'
    },
    markupPanel: {
      text: 'İşaret paneli',
      description: 'İşaret paletini açar'
    },
    markupText: {
      text: 'Metin',
      description: 'Metin işareti yerleştirir'
    },
    markupCloud: {
      text: 'Bulut',
      description: 'Bulut işareti oluşturur'
    },
    markupRect: {
      text: 'Dikdörtgen',
      description: 'Dikdörtgen işareti oluşturur'
    },
    markupCircle: {
      text: 'Daire',
      description: 'Daire işareti oluşturur'
    },
    markupArrow: {
      text: 'Ok',
      description: 'Ok işareti oluşturur'
    },
    markupLine: {
      text: 'Çizgi',
      description: 'Çizgi işareti oluşturur'
    },
    markupCallout: {
      text: 'Çağrı',
      description: 'Çağrı notu oluşturur'
    },
    markupStamp: {
      text: 'Damga',
      description: 'Damga yerleştirir'
    },
    markupImport: {
      text: 'İçe Aktar',
      description: 'İşaretleri sidecar JSON dosyasından içe aktarır'
    },
    markupExport: {
      text: 'Dışa Aktar',
      description: 'İşaretleri sidecar JSON dosyasına dışa aktarır'
    },
    markupColor: {
      text: 'Renk',
      description: 'Yeni işaret çizimleri için rengi ayarlar'
    },
    markupFontSize: {
      text: 'Yazı yüksekliği',
      description:
        'İşaretler için yazı yüksekliği ayarlarını açar (ekrana sığdır veya dünya yüksekliği)',
      fit: 'Fit',
      wcs: 'WCS'
    },
    measurementColor: {
      text: 'Renk',
      description: 'Seçili ölçümün veya sonraki ölçümlerin rengini ayarlar'
    },
    measurementShowApproximate: {
      text: 'Yuvarlanınca ~ göster',
      description:
        'Ölçülen değer görüntü hassasiyetine yuvarlandığında başına ~ ekler'
    },
    measurementFontSize: {
      text: 'Yazı yüksekliği',
      description:
        'Seçili ölçümün veya sonraki ölçümlerin yazı yüksekliği ayarlarını açar',
      fit: 'Fit',
      wcs: 'WCS'
    },
    showMarkup: {
      text: 'Göster',
      description: 'İşaretleri gösterir'
    },
    hideMarkup: {
      text: 'Gizle',
      description: 'İşaretleri gizler'
    },
    showMeasurements: {
      text: 'Göster',
      description: 'Ölçümleri gösterir'
    },
    hideMeasurements: {
      text: 'Gizle',
      description: 'Ölçümleri gizler'
    },
    clearMarkups: {
      text: 'Temizle',
      description: 'Geçerli baskı sayfasındaki tüm işaretleri temizler'
    },
    select: {
      text: 'Seç',
      description: 'Varlıkları seçer'
    },
    switchBg: {
      text: 'Değiştir',
      description: 'Çizim arka planını beyaz ve siyah arasında değiştirir',
      disabledInReadingMode:
        'Okuma modundayken kullanılamaz (beyaz tuval sabittir)'
    },
    zoom: {
      text: 'Yakınlaştır',
      description:
        'Yakınlaştırma araçları: kayıtlı görünüm, sınırlar, akıllı sınırlar ve pencere'
    },
    zoomSaved: {
      text: 'Kayıtlı',
      description:
        'AutoCAD kayıtlı görünümünü (VPORT / baskı sayfası limitleri) veya açılış görünümünü geri yükler'
    },
    zoomToExtent: {
      text: 'Sınırlar',
      description:
        'Tüm varlıkların maksimum sınırlarını görüntülemek için yakınlaştırır'
    },
    zoomSmartExtents: {
      text: 'Akıllı',
      description:
        'Uzak aykırı varlıkları yok sayarak baskın geometri kümesine yakınlaştırır'
    },
    zoomToBox: {
      text: 'Pencere',
      description:
        'Dikdörtgen bir pencereyle belirtilen alanı görüntülemek için yakınlaştırır'
    }
  },
  statusBar: {
    setting: {
      commandLine: 'Komut Satırı',
      coordinate: 'Koordinat',
      entityInfo: 'Varlık Bilgisi',
      languageSelector: 'Dil Seçici',
      ribbon: 'Şerit',
      toolbar: 'Araç Çubuğu',
      stats: 'İstatistikler',
      replaceOnClick: 'Tıklama seçimi değiştirir',
      continuousDraw: 'Çizmeye devam et (çizim aracında kal)'
    },
    osnap: {
      on: 'Yakalamayı kapat',
      off: 'Yakalamayı aç',
      enabled: 'Yakalamayı kullan',
      tooltip: 'Nesne Yakalama',
      endpoint: 'Uç Nokta',
      midpoint: 'Orta Nokta',
      center: 'Merkez',
      node: 'Düğüm',
      quadrant: 'Çeyrek',
      intersection: 'Kesişim',
      insertion: 'Ekleme',
      nearest: 'En Yakın'
    },
    pointStyle: {
      tooltip: 'Nokta stilini değiştir'
    },
    fullScreen: {
      on: 'Tam ekran modunu kapat',
      off: 'Tam ekran modunu aç'
    },
    dynamicInput: {
      on: 'Dinamik girişi kapat',
      off: 'Dinamik girişi aç'
    },
    lineWidth: {
      on: 'Çizgi genişliklerini gizle',
      off: 'Çizgi genişliklerini göster'
    },
    operationProfile: {
      simple: 'Basit',
      cad: 'CAD',
      simpleTooltip:
        'Basit kullanım: tıklama seçimi değiştirir ve her çizimden sonra Seç aracına dönülür. Tek tuşla araçlar (V Seç / H Kaydır / L Çizgi / R Dikdörtgen / T Metin; kaydırmak için Space basılıyken sürükleyin). CAD (klasik) kullanıma geçmek için tıklayın',
      cadTooltip:
        'CAD (klasik) kullanım: her tıklama seçime ekler ve çizim komutları Enter / Esc tuşuna kadar sürer. Basit kullanıma geçmek için tıklayın'
    },
    orthoMode: {
      on: 'Ortogonal modu kapat',
      off: 'Ortogonal modu aç'
    },
    polarTracking: {
      on: 'Kutupsal izlemeyi kapat',
      off: 'Kutupsal izlemeyi aç',
      menuTitle: 'Kutupsal izleme açısı',
      menuTooltip: 'Kutupsal izleme açısını seçin',
      step: 'Her {angle}'
    },
    zoom: {
      zoomIn: 'Yakınlaştır',
      zoomOut: 'Uzaklaştır',
      fitAll: 'Tümünü göster',
      tooltip:
        'Görüntü ölçeği (ekrandaki uzunluk : gerçek uzunluk). Liste için tıklayın'
    },
    theme: {
      toLight: 'Açık temaya geç',
      toDark: 'Koyu temaya geç'
    },
    warning: {
      font: 'Aşağıdaki yazı tipleri bulunamadı!'
    },
    notification: {
      tooltip: 'Bildirimleri göster'
    },
    export: {
      tooltip: 'Görüntüyü PNG olarak dışa aktar'
    },
    modelTab: 'Tuval',
    moreLayouts: 'Diğer baskı sayfaları'
  },
  toolPalette: {
    entityProperties: {
      tab: 'Özellikler',
      title: 'Varlık Özellikleri',
      propertyPanel: {
        noEntitySelected: 'Hiçbir varlık seçilmedi!',
        multipleEntitySelected: '{count} varlık seçildi',
        propValCopied: 'Özellik değeri kopyalandı',
        failedToCopyPropVal: 'Özellik değeri kopyalanamadı!',
        selection: 'Seçim',
        mixed: 'Karışık',
        x: 'X',
        y: 'Y',
        width: 'Gen',
        height: 'Yük',
        keepAspectHint: 'Seçimi oranlarını koruyarak ölçekler',
        referencePoint: 'Referans noktası',
        anchor: {
          topLeft: 'Sol üst',
          top: 'Üst',
          topRight: 'Sağ üst',
          left: 'Sol',
          center: 'Merkez',
          right: 'Sağ',
          bottomLeft: 'Sol alt',
          bottom: 'Alt',
          bottomRight: 'Sağ alt'
        },
        selectOnlyType: 'Yalnızca {type} seç',
        totalLength: 'Toplam uzunluk',
        totalArea: 'Toplam alan',
        itemCount: '({count} öğe)',
        invisibleAttribute: 'Gizli alan',
        constantAttribute: 'Sabit (değiştirilemez)',
        allLocked: 'Bu nesneler kilitli katmanlarda ve değiştirilemez',
        someLocked: 'Kilitli katmanlardaki nesneler değiştirilmez'
      }
    },
    layerManager: {
      tab: 'Katmanlar',
      title: 'Katman Yöneticisi',
      currentLayerLabel: 'Geçerli katman: {name}',
      searchPlaceholder: 'Katman ara',
      filters: 'Filtreler',
      collapseFilters: 'Filtreleri daralt',
      expandFilters: 'Filtreleri genişlet',
      filterAll: 'Tümü',
      filterAllUsed: 'Kullanılan Tüm Katmanlar',
      toolbar: {
        showFilters: 'Katman Filtreleri',
        newFilter: 'Yeni Filtre',
        newFilterGroup: 'Yeni Grup Filtresi',
        newLayer: 'Yeni Katman',
        deleteLayer: 'Katmanı Sil',
        setCurrent: 'Geçerli Yap'
      },
      prompts: {
        newFilterTitle: 'Yeni Filtre',
        newFilterName: 'Filtre adını girin',
        newFilterGroupTitle: 'Yeni Grup Filtresi',
        newFilterGroupName: 'Grup filtresi adını girin',
        newLayerTitle: 'Yeni Katman',
        newLayerName: 'Katman adını girin',
        confirm: 'Tamam',
        cancel: 'İptal'
      },
      messages: {
        filterCreated: '"{name}" filtresi oluşturuldu',
        filterExists: '"{name}" adlı filtre zaten var',
        filterCreateFailed: 'Filtre oluşturulamadı',
        layerCreated: '"{name}" katmanı oluşturuldu',
        layerExists: '"{name}" katmanı zaten var',
        layerCreateFailed: 'Katman oluşturulamadı',
        layerDeleted: '"{name}" katmanı silindi',
        layerDeleteFailed: '"{name}" katmanı silinemedi',
        cannotDeleteLayer0: '"0" katmanı silinemez',
        cannotDeleteCurrent: 'Geçerli katman silinemez',
        selectLayerFirst: 'Önce bir katman seçin',
        setCurrentSuccess: 'Geçerli katman "{name}" olarak ayarlandı',
        setCurrentFailed: 'Geçerli katman ayarlanamadı'
      },
      layerList: {
        name: 'Ad',
        on: 'Açık',
        lock: 'Kilitle',
        plot: 'Çizdir',
        color: 'Renk',
        linetype: 'Çizgi türü',
        lineweight: 'Çizgi kalınlığı',
        transparency: 'Saydamlık',
        description: 'Açıklama',
        currentLayer: 'Geçerli katman',
        newLayerPlaceholder: 'Katman adı',
        zoomToLayer: 'Tıklanan "{layer}" katmanına yakınlaştırıldı',
        lineWeightDefault: 'Varsayılan'
      }
    },
    find: {
      tab: 'Bul',
      title: 'Bul',
      placeholder: 'Metin ara',
      input: 'Aranacak metin',
      find: 'Bul',
      matchCase: 'Büyük/küçük harf duyarlı',
      currentLayoutOnly: 'Yalnızca geçerli baskı sayfası',
      hint: 'Tüm çizimde (tüm baskı sayfaları) metin, çok satırlı metin, sembol özellikleri ile sembol, ölçü, kılavuz ve tablolardaki metni aramak için Enter tuşuna basın.',
      hintLayout:
        'Geçerli baskı sayfasında metin, çok satırlı metin, sembol özellikleri ile sembol, ölçü, kılavuz ve tablolardaki metni aramak için Enter tuşuna basın.',
      noResults: 'Metin bulunamadı',
      count: '{count} sonuç',
      countLayouts: '{layouts} baskı sayfasında {count} sonuç',
      countTruncated: 'İlk {count} sonuç gösteriliyor — aramayı daraltın',
      noDocument: 'Aramak için bir çizim açın',
      layoutUnavailable: '"{layout}" baskı sayfası açılamadı',
      unnamedLayout: '(adsız baskı sayfası)',
      kind: {
        text: 'Metin',
        mtext: 'Çok satırlı metin',
        attribute: 'Sembol özelliği',
        block: 'Sembol metni',
        dimension: 'Ölçü',
        leader: 'Kılavuz',
        table: 'Tablo'
      }
    },
    countList: {
      tab: 'Sayım',
      title: 'Sayım',
      searchPlaceholder: 'Sembol adı ara',
      countInArea: 'Alanda say',
      areaSet: 'Sayım alanı güncellendi',
      areaCleared: 'Tüm tuval sayılıyor',
      blockName: 'Sembol',
      count: 'Adet',
      empty: 'Görünür sembol bulunamadı',
      prompt: {
        firstCorner: 'Sayım alanının ilk köşesini belirtin veya [Entire]: ',
        secondCorner: 'Karşı köşeyi belirtin: '
      }
    },
    designReview: {
      tab: 'İnceleme',
      title: 'İnceleme',
      searchPlaceholder: 'İşaretlerde ara',
      empty: 'Henüz işaret yok',
      type: 'Tür',
      status: 'Durum',
      author: 'Yazar',
      summary: 'Özet',
      details: 'Ayrıntılar',
      closeDetails: 'Ayrıntıları kapat',
      label: 'Etiket',
      comment: 'Yorum',
      zoomTo: 'Yakınlaştır',
      delete: 'Sil',
      clear: 'Tümünü temizle',
      statusValues: {
        open: 'Açık',
        question: 'Soru',
        answered: 'Yanıtlandı',
        closed: 'Kapalı'
      }
    },
    measurements: {
      tab: 'Ölçüm',
      title: 'Ölçümler',
      empty: 'Henüz ölçüm yok',
      type: 'Tür',
      value: 'Değer',
      filterAll: 'Tümü',
      delete: 'Sil',
      clear: 'Tümünü temizle',
      typeValues: {
        distance: 'Mesafe',
        angle: 'Açı',
        area: 'Alan',
        arc: 'Yay',
        point: 'XY'
      }
    },
    missingResources: {
      tab: 'Kaynaklar',
      title: 'Eksik / Harici Kaynaklar',
      fontTab: 'Yazı tipi',
      imageTab: 'Görsel',
      xrefTab: 'Bağlantılı Çizimler',
      attach: 'Ekle',
      attachDwg: 'DWG/DXF ekle...',
      attachImage: 'Görüntü ekle...',
      attachImageFailed: '"{name}" görüntüsü eklenemedi',
      fileReferences: 'Dosya Referansları',
      details: 'Ayrıntılar',
      foundAt: 'Bulunduğu yer',
      selectReference: 'Ayrıntıları görmek için bir referans seçin',
      expandDetails: 'Ayrıntıları genişlet',
      collapseDetails: 'Ayrıntıları daralt',
      apply: 'Uygula',
      applyDone: 'Değiştirmeler uygulandı',
      emptyFonts: 'Eksik yazı tipi yok',
      emptyImages: 'Eksik görsel yok',
      matchFontType: 'Yazı tipi türünü eşleştir (SHX / mesh)',
      missedFont: 'Eksik yazı tipi',
      replacedFont: 'Yerine kullanılan yazı tipi',
      selectFont: 'Yerine kullanılacak yazı tipini seçin',
      selectLocalFont: 'Yerel yazı tipi dosyası seçin',
      file: 'Dosya',
      replace: 'Değiştir',
      name: 'Ad',
      path: 'Kayıtlı yol',
      type: 'Tür',
      typeAttach: 'Ekle',
      typeOverlay: 'Kaplama',
      typeImage: 'Görüntü',
      status: 'Durum',
      statusMissing: 'Eksik',
      statusLoaded: 'Yüklendi',
      actions: 'İşlemler',
      visible: 'Görünür',
      browse: 'Gözat…',
      fromUrl: 'URL…',
      unload: 'Kaldır',
      load: 'Yükle',
      empty: 'Bu çizimde bağlantılı çizim veya görüntü yok',
      urlPrompt: 'Çizim dosyasının (DWG, DXF vb.) URL’sini girin',
      urlRequired: 'Lütfen bir URL girin',
      loadFailed: '"{name}" referansı yüklenemedi'
    },
    memoryProfile: {
      tab: 'Bellek',
      title: 'Bellek Profili',
      refresh: 'Yenile',
      collecting: 'Bellek analiz ediliyor ...',
      showPie: 'Özet grafiği göster',
      hidePie: 'Özet grafiği gizle',
      collectedAt: 'Toplama zamanı {time}',
      heapUsed: 'JS yığını {used} / {total}',
      estimateNote:
        'Geometri boyutları tampon byteLength değerinden gelir. Diğer kategoriler tahmindir.',
      estimated: 'tah.',
      pieTotal: 'Hesaplanan',
      pieAriaLabel: 'Kategoriye göre bellek dağılımı',
      empty: 'Veri yok',
      missedFonts: 'Eksik yazı tipleri',
      fontMemory: 'Yazı tipi / mtext belleği',
      fontMemorySummary: 'Bellek {live} (ana {main} · worker {workers})',
      fontStorage: 'IndexedDB depolama (belleğe dahil değil)',
      fontStorageSummary: '{count} önbellek yazı tipi · {size}',
      materialPoint: 'Nokta',
      materialLine: 'Çizgi',
      materialFill: 'Dolgu',
      materialTotal: 'Toplam',
      dataModelCounts: '{entities} varlık · {objects} nesne · {total}',
      dataModelCategories: 'Kategoriye göre',
      dataModelEntityTypes: 'Varlık türüne göre',
      categories: {
        heap: 'JS Yığını',
        geometry: 'Geometri',
        mapping: 'Eşleme',
        spatial: 'Uzamsal Dizin',
        dataModel: 'Veri Modeli',
        materials: 'Malzemeler',
        fonts: 'Yazı Tipleri'
      },
      tabs: {
        geometry: 'Geometri',
        spatial: 'Uzamsal',
        dataModel: 'Veri Modeli',
        materials: 'Malzemeler',
        fonts: 'Yazı Tipleri'
      },
      columns: {
        layout: 'Baskı sayfası',
        layer: 'Katman',
        geometry: 'Geometri',
        mapping: 'Eşleme',
        entities: 'Varlıklar',
        rootItems: 'Kök',
        childItems: 'Alt',
        estimated: 'Tah. boyut',
        type: 'Tür',
        count: 'Adet',
        category: 'Kategori',
        font: 'Yazı tipi'
      }
    },
    openFileProfile: {
      tab: 'Açılış',
      title: 'Açılış Performansı',
      refresh: 'Yenile',
      copy: 'Kopyala',
      copied: 'Performans verileri kopyalandı',
      copyFailed: 'Performans verileri kopyalanamadı',
      collectedAt: 'Toplama zamanı {time}',
      hint: 'Son çizim açılışında otomatik toplanır. OPENPROF=1 konsola da yazar.',
      noData:
        'Henüz profil yok. Önce bir çizim açın, sonra OPENPERF çalıştırın.',
      empty: 'Veri yok',
      timing: 'Duvar saati zamanlaması',
      progressive: 'Kademeli açılış',
      progressiveMode: 'Mod',
      progressiveOn: 'Açık',
      progressiveOff: 'Kapalı',
      midOpenPaints: 'Açılış sırası çizimler',
      yields: 'Yield sayısı',
      cache: 'INSERT render önbelleği (üst düzey)',
      slowBlocks: 'En yavaş sembol şablon missleri',
      total: 'Toplam açılış',
      read: 'db.read',
      parse: 'PARSE',
      entity: 'ENTITY flush',
      convert: 'Sahne dönüşümü',
      cacheHits: 'Önbellek isabet',
      cacheMisses: 'Önbellek miss',
      cacheBuild: 'Miss build',
      cacheCompact: 'Miss compact',
      cacheHitPath: 'Hit path',
      columns: {
        stage: 'Aşama',
        duration: 'Süre',
        share: 'Pay',
        metric: 'Metrik',
        value: 'Değer',
        block: 'Sembol',
        build: 'Build',
        compact: 'Compact'
      }
    },
    blocks: {
      tab: 'Semboller',
      title: 'Semboller',
      tabCurrentDrawing: 'Geçerli Çizim',
      tabRecent: 'Son Kullanılanlar',
      tabFavorites: 'Favoriler',
      tabLibraries: 'Kitaplıklar',
      sectionCurrentDrawing: 'Geçerli Çizimdeki Semboller',
      sectionRecent: 'Son Kullanılan Semboller',
      sectionFavorites: 'Favori Semboller',
      sectionLibraries: 'Sembol Kitaplıkları',
      filterPlaceholder: 'Filtrele...',
      empty: 'Kullanılabilir sembol yok',
      emptyRecent: 'Son eklenen sembol yok',
      emptyFavorites: 'Favori sembol yok',
      emptyLibraries: 'Yapılandırılmış kitaplık yok',
      toggleFavorite: 'Favoriyi değiştir',
      options: 'Seçenekler',
      insertionPoint: 'Ekleme Noktası',
      scale: 'Ölçek',
      rotation: 'Döndürme',
      angle: 'Açı',
      autoPlacement: 'Otomatik Yerleştirme',
      repeatPlacement: 'Yerleştirmeyi Tekrarla',
      explode: 'Patlat'
    }
  },
  colorDropdown: {
    custom: 'Özel'
  },
  lineTypeSelect: {
    placeholder: 'Çizgi Türü'
  },
  colorIndexPicker: {
    color: 'Renk: ',
    colorIndex: 'Renk İndeksi: ',
    inputPlaceholder: '0-256, BYLAYER, BYBLOCK',
    rgb: 'RGB: '
  },
  entityInfo: {
    color: 'Renk',
    layer: 'Katman',
    lineType: 'Çizgi Türü'
  },
  ribbonProperty: {
    color: 'Renk',
    lineType: 'Çizgi Türü',
    lineWeight: 'Çizgi Kalınlığı',
    layer: 'Katman'
  },
  layerSelect: {
    searchPlaceholder: 'Katman adı ara',
    noLayerAvailable: 'Kullanılabilir katman yok',
    noMatchedLayer: 'Eşleşen katman yok',
    tooltip: {
      layer: 'Katman',
      visibility: 'Görünürlük',
      lock: 'Kilitle',
      lineType: 'Çizgi Türü',
      color: 'Renk',
      visible: 'Görünür',
      hidden: 'Gizli',
      locked: 'Kilitli',
      unlocked: 'Kilidi Açık'
    }
  },
  message: {
    loadingFonts: 'Yazı tipleri yükleniyor ...',
    loadingDwgConverter: 'DWG dönüştürücü yükleniyor...',
    fontsNotFound: '{fonts} yazı tipleri yazı tipi deposunda bulunamıyor!',
    fontsNotLoaded: '{fonts} yazı tipleri yüklenemiyor!',
    fontMissedInDrawing:
      '"{font}" yazı tipi {count} metin nesnesi tarafından gerekli ancak kullanılamıyor. "{replacementFont}" ile gösteriliyor.',
    fontMissedReplacement: '"{font}" ("{replacement}" ile gösteriliyor)',
    fontCached: '"{font}" yazı tipi başarıyla önbelleğe alındı.',
    fontCacheFailed: '"{fileName}" yazı tipi önbelleğe alınamadı.',
    failedToGetAvaiableFonts:
      '"{url}" adresinden kullanılabilir yazı tipleri alınamadı!',
    failedToOpenFile: '"{fileName}" dosyası açılamadı!',
    failedToOpenFileToast:
      '"{fileName}" açılamadı. Ayrıntılar için bildirim merkezine bakın.',
    failedToOpenFileWorkerOom:
      '"{fileName}" açılamadı. Ayrıştırma, yetersiz bellek nedeniyle başarısız oldu (LibreDWG parser). Büyük çizimleri çökmeden açmak için ticari DWG parser satın almak üzere {dwgParserLink} bağlantısına tıklayabilirsiniz.',
    failedToOpenFileWorkerOomLink: 'bu sayfa',
    failedToOpenFileWorkerTimeout:
      '"{fileName}" açılamadı. Çizim ayrıştırılırken işlem zaman aşımına uğradı.',
    failedToOpenFileFontLoadFailed:
      '"{fileName}" açılamadı. Gerekli yazı tipleri yüklenemedi.',
    failedToOpenFileLicenseExpired:
      '"{fileName}" açılamadı. DWG dönüştürücü lisansı süresi dolmuş.',
    failedToOpenFileLicenseInvalid:
      '"{fileName}" açılamadı. DWG dönüştürücü lisansı eksik veya geçersiz.',
    fetchingDrawingFile: 'Dosya alınıyor ...',
    unknownEntities:
      'Bu çizim {count} bilinmeyen veya desteklenmeyen varlık içeriyor! Bu varlıklar gösterilmeyecek.',
    tianzhengEntities:
      'Bu çizim TArch / Tianzheng (veya benzeri üçüncü taraf) özel varlıklar içeriyor (yaklaşık {count}). Bu ortamda tam olarak ayrıştırılamazlar, bu nedenle bazı içerikler görüntülenmeyebilir.',
    emptyProxyEntities:
      'Bu çizim proxy grafiği olmayan {count} özel varlık içeriyor! Bu varlıklar gösterilmeyecek.'
  },
  notification: {
    center: {
      title: 'Bildirimler',
      clearAll: 'Tümünü Temizle',
      noNotifications: 'Bildirim yok'
    },
    group: {
      fontMissed: 'Eksik Yazı Tipleri',
      fontMissedSummary:
        '{count} yazı tipi ile ilgili mesaj. Ayrıntılar için tıklayın.',
      unsupportedEntities: 'Desteklenmeyen Varlıklar',
      unsupportedEntitiesSummary:
        '{count} ayrıştırma ile ilgili mesaj. Ayrıntılar için tıklayın.',
      genericSummary: '{count} mesaj. Ayrıntılar için tıklayın.'
    },
    time: {
      justNow: 'Az önce',
      minutesAgo: '{count} dakika önce | {count} dakika önce',
      hoursAgo: '{count} saat önce | {count} saat önce',
      daysAgo: '{count} gün önce | {count} gün önce'
    },
    title: {
      failedToOpenFile: 'Dosya Açılamadı',
      failedToOpenFileWorkerOom: 'Yetersiz Bellek',
      failedToOpenFileWorkerTimeout: 'Açma Zaman Aşımı',
      failedToOpenFileFontLoadFailed: 'Yazı Tipi Yüklenemedi',
      failedToOpenFileLicenseExpired: 'Lisans Süresi Doldu',
      failedToOpenFileLicenseInvalid: 'Geçersiz Lisans',
      fontNotFound: 'Yazı Tipi Bulunamadı',
      fontNotLoaded: 'Yazı Tipi Yüklenemedi',
      parsingWarning: 'Çizim Ayrıştırma Sorunları',
      systemMessage: 'Sistem Mesajı',
      systemWarning: 'Sistem Uyarısı',
      systemError: 'Sistem Hatası',
      systemInfo: 'Sistem Bilgisi'
    }
  }
}
