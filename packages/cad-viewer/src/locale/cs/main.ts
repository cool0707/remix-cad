export default {
  mainMenu: {
    new: 'Nový výkres',
    open: 'Otevřít výkres',
    drawingUnits: 'Jednotky výkresu',
    exportMenu: 'Export',
    export: 'Exportovat do DXF',
    exportHtml: 'Exportovat do HTML',
    exportPdf: 'Exportovat do PDF',
    exportSvg: 'Exportovat do SVG',
    exportAs: 'Exportovat do {format}',
    exportImage: 'Exportovat do obrázku',
    exportImageArea: 'Exportovat vybranou oblast jako obrázek',
    about: 'O aplikaci'
  },
  ribbon: {
    tab: {
      home: 'Domů',
      insert: 'Vložit',
      review: 'Kontrola',
      measurement: 'Měření',
      hatchContext: 'Vzorová výplň',
      mtextEditorContext: 'Editor textu'
    },
    hatch: {
      group: {
        boundary: 'Hranice',
        pattern: 'Vzor',
        properties: 'Vlastnosti',
        options: 'Možnosti',
        close: 'Zavřít'
      },
      command: {
        pickPoints: 'Určit body',
        selectObjects: 'Vybrat objekty',
        close: 'Zavřít'
      },
      field: {
        pattern: 'Vzor',
        scale: 'Měřítko',
        angle: 'Úhel',
        style: 'Styl',
        associative: 'Asociativní',
        fillType: 'Typ výplně',
        fillColor: 'Barva',
        patternColor: 'Barva vzoru',
        gradient1Color: 'Barva přechodu 1',
        backgroundColor: 'Barva pozadí',
        gradient2Color: 'Barva přechodu 2',
        opacity: 'Průhlednost',
        imageScale: 'Měřítko obrázku'
      },
      style: {
        normal: 'Normální',
        outer: 'Vnější',
        ignore: 'Ignorovat'
      },
      fillType: {
        solid: 'Plná',
        pattern: 'Vzor',
        gradient: 'Přechod'
      },
      associative: {
        on: 'Zapnuto',
        off: 'Vypnuto'
      },
      tooltip: {
        pickPoints: 'Určete vnitřní body pro vytvoření vyplněných oblastí.',
        selectObjects: 'Vyberte uzavřené hraniční objekty k vyplnění.',
        pattern: 'Zvolte název vzoru výplně.',
        scale: 'Nastavte měřítko vzoru výplně.',
        angle: 'Nastavte úhel vzoru výplně ve stupních.',
        style: 'Určuje způsob detekce ostrůvků při vytváření vzorové výplně.',
        associative: 'Přepne asociativní režim vzorové výplně.',
        fillType: 'Zvolte typ výplně: plná, vzor nebo přechod.',
        fillColor: 'Zvolte barvu výplně.',
        patternColor: 'Zvolte barvu čar vzoru.',
        gradient1Color: 'Zvolte první barvu přechodu.',
        backgroundColor: 'Zvolte barvu pozadí výplně vzorem.',
        gradient2Color: 'Zvolte druhou barvu přechodu.',
        opacity: 'Nastavte průhlednost vzorové výplně (0–90).',
        imageScale: 'Nastavte měřítko obrázkové výplně.',
        close: 'Ukončí vytváření vzorové výplně a zavře tuto kontextovou kartu.'
      }
    },
    mtext: {
      group: {
        textStyle: 'Textový styl',
        format: 'Formát',
        paragraph: 'Odstavec',
        insert: 'Vložit',
        close: 'Zavřít'
      },
      field: {
        textStyle: 'Textový styl',
        font: 'Font',
        color: 'Barva',
        height: 'Výška',
        obliqueAngle: 'Úhel sklonu',
        tracking: 'Prostrkání',
        widthFactor: 'Faktor šířky'
      },
      characterMap: {
        title: 'Mapa znaků',
        font: 'Font(F):',
        charsToCopy: 'Znaky ke zkopírování(A):',
        select: 'Vybrat(S)',
        copy: 'Kopírovat(C)',
        noGlyphs: 'Pro tento font nejsou k dispozici žádné znaky.',
        copyFailed: 'Nelze zkopírovat do schránky.'
      },
      command: {
        bold: 'Tučné',
        underline: 'Podtržené',
        superscript: 'Horní index',
        italic: 'Kurzíva',
        overline: 'Nadtržené',
        subscript: 'Dolní index',
        strikethrough: 'Přeškrtnuté',
        stack: 'Zlomek',
        toggleCase: 'Velká/malá písmena',
        attachment: 'Zarovnání',
        list: 'Odrážky a číslování',
        lineSpacing: 'Řádkování',
        paragraphAlignment: 'Zarovnání odstavce',
        symbol: 'Symbol',
        close: 'Zavřít'
      },
      tooltip: {
        textStyle: 'Zvolte textový styl z aktuálního výkresu.',
        bold: 'Přepne tučné písmo.',
        underline: 'Přepne podtržení.',
        superscript: 'Přepne horní index.',
        italic: 'Přepne kurzívu.',
        overline: 'Přepne nadtržení.',
        subscript: 'Přepne dolní index.',
        strikethrough: 'Přepne přeškrtnutí.',
        stack: 'Vytvoří nebo zruší zlomek z vybraného textu.',
        toggleCase: 'Přepne vybraný text mezi velkými a malými písmeny.',
        font: 'Nastaví aktuální font textu.',
        color: 'Nastaví aktuální barvu textu.',
        height: 'Nastaví aktuální výšku textu. Lze zadat vlastní hodnotu.',
        obliqueAngle:
          'Nastaví úhel sklonu vybraných znaků ve stupních (záporná hodnota naklání na druhou stranu).',
        tracking:
          'Zvětší nebo zmenší mezery mezi vybranými znaky (výchozí je 1).',
        widthFactor:
          'Vodorovně roztáhne nebo stlačí vybrané znaky (výchozí je 1).',
        attachment: 'Nastaví bod ukotvení víceřádkového textu.',
        list: 'Vloží nebo nastaví odrážky a číslování.',
        lineSpacing: 'Nastaví řádkování.',
        paragraphAlignment: 'Nastaví vodorovné zarovnání odstavce.',
        symbol: 'Vloží běžný technický symbol.',
        close: 'Zavře editor textu a tuto kontextovou kartu.'
      },
      attachment: {
        TL: 'Vlevo nahoře TL',
        TC: 'Uprostřed nahoře TC',
        TR: 'Vpravo nahoře TR',
        ML: 'Vlevo uprostřed ML',
        MC: 'Uprostřed MC',
        MR: 'Vpravo uprostřed MR',
        BL: 'Vlevo dole BL',
        BC: 'Uprostřed dole BC',
        BR: 'Vpravo dole BR'
      },
      list: {
        off: 'Vypnuto',
        number: 'Číslované',
        letter: 'Písmena',
        bullet: 'Odrážky',
        start: 'Začít',
        continue: 'Pokračovat',
        auto: 'Povolit automatické odrážky a číslování',
        allowList: 'Povolit odrážky a seznamy'
      },
      lineSpacing: {
        more: 'Více…',
        clear: 'Zrušit mezery odstavce'
      },
      paragraphAlign: {
        default: 'Výchozí',
        left: 'Vlevo',
        center: 'Na střed',
        right: 'Vpravo',
        justified: 'Do bloku',
        distributed: 'Rovnoměrně'
      },
      symbol: {
        degree: 'Stupně  %%d',
        plusMinus: 'Plus/minus  %%p',
        diameter: 'Průměr  %%c',
        almostEqual: 'Přibližně rovno  \\U+2248',
        angle: 'Úhel  \\U+2220',
        boundary: 'Hraniční čára  \\U+E100',
        centerLine: 'Osa  \\U+2104',
        delta: 'Delta  \\U+0394',
        electricalPhase: 'Elektrická fáze  \\U+0278',
        flowLine: 'Čára toku  \\U+E101',
        identical: 'Identické s  \\U+2261',
        notEqual: 'Nerovná se  \\U+2260',
        ohm: 'Ohm  \\U+2126',
        omega: 'Omega  \\U+03A9',
        propertyLine: 'Hranice pozemku  \\U+214A',
        subscriptTwo: 'Dolní index 2  \\U+2082',
        squared: 'Na druhou  \\U+00B2',
        cubed: 'Na třetí  \\U+00B3',
        nbsp: 'Nezlomitelná mezera Ctrl+Shift+Mezerník',
        other: 'Další…'
      }
    },
    group: {
      draw: 'Kreslení',
      modify: 'Úpravy',
      layer: 'Hladiny',
      properties: 'Vlastnosti',
      utilities: 'Nástroje',
      annotation: 'Poznámky',
      review: 'Kontrola',
      measurement: 'Měření',
      style: 'Styl',
      lengthUnits: 'Jednotky délky',
      angleUnits: 'Jednotky úhlu',
      reference: 'Reference',
      block: 'Symbol'
    },
    insertBlock: {
      empty: 'Žádné symboly nejsou k dispozici',
      currentDrawing: 'Aktuální výkres',
      previewMenu: 'Galerie náhledů symbolů'
    },
    property: {
      color: 'Barva',
      lineColor: 'Barva čáry',
      lineType: 'Typ čáry',
      lineWeight: 'Tloušťka čáry'
    },
    layerTools: {
      select: 'Hladina',
      off: 'Vypnout hladinu',
      isolate: 'Izolovat',
      lock: 'Uzamknout hladinu',
      current: 'Nastavit aktuální',
      allOn: 'Zapnout hladiny',
      unisolate: 'Zrušit izolaci',
      unlock: 'Odemknout hladinu',
      restore: 'Obnovit hladiny'
    },
    arc: {
      threePoint: '3 body',
      startCenterEnd: 'Počátek, střed, konec',
      startCenterAngle: 'Počátek, střed, úhel',
      startCenterLength: 'Počátek, střed, délka',
      startEndAngle: 'Počátek, konec, úhel',
      startEndDirection: 'Počátek, konec, směr',
      startEndRadius: 'Počátek, konec, poloměr',
      centerStartEnd: 'Střed, počátek, konec',
      centerStartAngle: 'Střed, počátek, úhel',
      centerStartLength: 'Střed, počátek, délka'
    },
    circle: {
      centerRadius: 'Střed, poloměr',
      centerDiameter: 'Střed, průměr',
      twoPoint: '2 body',
      threePoint: '3 body',
      tanTanRadius: 'Tečna, tečna, poloměr',
      tanTanTan: 'Tečna, tečna, tečna'
    },
    ellipse: {
      ellipse: 'Elipsa',
      arc: 'Eliptický oblouk'
    },
    tooltip: {
      line: 'Nakreslí jednu úsečku.',
      polyline: 'Nakreslí spojenou řadu úseček nebo oblouků jako jeden objekt.',
      spline: 'Nakreslí hladkou křivku splajn proložením nebo řídicími body.',
      sketch: 'Vytvoří řadu úseček kreslených od ruky.',
      revcloud: 'Vytvoří revizní obláček pro zvýraznění oblastí výkresu.',
      circle: 'Nakreslí kružnici několika způsoby konstrukce.',
      arc: 'Nakreslí oblouk několika způsoby konstrukce.',
      mline: 'Nakreslí několik rovnoběžných čar jako jeden objekt.',
      ray: 'Nakreslí polopřímku z počátečního bodu.',
      xline: 'Nakreslí nekonečnou konstrukční přímku.',
      ellipse: 'Nakreslí elipsu nebo eliptický oblouk.',
      rect: 'Nakreslí obdélník nebo pravidelný mnohoúhelník.',
      point: 'Umístí do výkresu bod.',
      hatch: 'Vyplní uzavřenou oblast vzorem (šrafování).',
      text: 'Vytvoří ve výkresu víceřádkový text.',
      move: 'Posune vybrané objekty na novou pozici.',
      rotate: 'Otočí vybrané objekty kolem základního bodu.',
      copy: 'Zkopíruje vybrané objekty na nové místo.',
      erase: 'Odstraní vybrané objekty z výkresu.',
      offset: 'Vytvoří rovnoběžnou kopii objektu v zadané vzdálenosti.',
      undo: 'Vrátí zpět poslední úpravu.',
      redo: 'Zopakuje poslední vrácenou úpravu.',
      properties: 'Otevře paletu Vlastnosti pro aktuální výběr.',
      quickSelect:
        'Otevře panel Výběr podle kritérií (rychlý výběr) pro filtrování a výběr objektů podle typu, hladiny a dalších kritérií.',
      find: 'Otevře paletu Hledat pro hledání textu v celém výkresu nebo na aktuální tiskové stránce.',
      countList: 'Otevře paletu Počet pro zobrazení a správu počtu symbolů (bloků).',
      missingResources:
        'Otevře paletu Chybějící / externí zdroje pro fonty, obrázky a propojené výkresy (externí reference).',
      drawingUnits:
        'Otevře Jednotky výkresu pro nastavení formátu souřadnic, přesnosti a měřítka vkládání.',
      attachDwg:
        'Připojí výkres DWG nebo DXF jako propojený výkres (externí reference) (XATTACH).',
      attachImage:
        'Připojí rastrový obrázek jako odkaz (IMAGEATTACH).',
      insert:
        'Otevře paletu Symboly (bloky) pro procházení a vkládání definic symbolů (INSERT).',
      editAttributes:
        'Upraví hodnoty a nastavení zobrazení vlastností symbolu (atributů bloku) (ATTEDIT).',
      defineAttribute:
        'Vytvoří vlastnost (definici atributu) pro použití v symbolu (ATTDEF).',
      agent:
        'Otevře kartu palety CAD Agent pro kreslení geometrie přirozeným jazykem.',
      propertyColor: 'Nastaví barvu nových nebo vybraných objektů.',
      propertyLineType: 'Nastaví typ čáry (linetype) nových nebo vybraných objektů.',
      propertyLineWeight:
        'Nastaví tloušťku čáry nových nebo vybraných objektů.',
      layerAction: {
        off: 'Vypne vybranou hladinu, takže se její objekty skryjí.',
        isolate:
          'Zobrazí pouze vybranou hladinu a ostatní skryje, abyste se mohli soustředit na související objekty.',
        lock: 'Uzamkne vybranou hladinu, její objekty zůstanou viditelné, ale nelze je upravovat.',
        current:
          'Nastaví vybranou hladinu jako aktuální, nové objekty vzniknou na ní.',
        allOn: 'Zobrazí všechny skryté hladiny.',
        unisolate:
          'Obnoví hladiny skryté nebo uzamčené funkcí Izolovat a zachová pozdější změny hladin.',
        unlock:
          'Odemkne vybranou hladinu, její objekty lze opět vybírat a upravovat.',
        restore:
          'Obnoví předchozí stav hladin z poslední akce s hladinami na tomto pásu karet.'
      },
      circleOption: {
        centerRadius: 'Vytvoří kružnici zadáním středu a poloměru.',
        centerDiameter: 'Vytvoří kružnici zadáním středu a průměru.',
        twoPoint: 'Vytvoří kružnici, jejíž průměr je určen dvěma body.',
        threePoint: 'Vytvoří kružnici procházející třemi body.',
        tanTanRadius:
          'Vytvoří kružnici tečnou ke dvěma objektům se zadaným poloměrem.',
        tanTanTan: 'Vytvoří kružnici tečnou ke třem objektům.'
      },
      arcOption: {
        threePoint:
          'Vytvoří oblouk procházející počátečním, druhým a koncovým bodem.',
        startCenterEnd:
          'Vytvoří oblouk zadáním počátečního bodu, středu a koncového bodu.',
        startCenterAngle:
          'Vytvoří oblouk z počátečního bodu, středu a sevřeného úhlu.',
        startCenterLength:
          'Vytvoří oblouk z počátečního bodu, středu a délky oblouku.',
        startEndAngle:
          'Vytvoří oblouk z počátečního a koncového bodu se sevřeným úhlem.',
        startEndDirection:
          'Vytvoří oblouk z počátečního a koncového bodu se směrem tečny v počátečním bodě.',
        startEndRadius:
          'Vytvoří oblouk z počátečního a koncového bodu se zadaným poloměrem.',
        centerStartEnd:
          'Vytvoří oblouk zadáním středu, počátečního a koncového bodu.',
        centerStartAngle:
          'Vytvoří oblouk zadáním středu, počátečního bodu a sevřeného úhlu.',
        centerStartLength:
          'Vytvoří oblouk zadáním středu, počátečního bodu a délky oblouku.'
      },
      rectOption: {
        rectangle: 'Vytvoří obdélník zadáním protilehlých rohů nebo rozměrů.',
        polygon:
          'Vytvoří pravidelný mnohoúhelník zadáním počtu stran a způsobu konstrukce.'
      },
      ellipseOption: {
        ellipse: 'Vytvoří celou elipsu zadáním hlavní a vedlejší osy.',
        arc: 'Vytvoří eliptický oblouk zadáním os elipsy a mezí oblouku.'
      }
    },
    command: {
      line: 'Úsečka',
      polyline: 'Křivka',
      circle: 'Kružnice',
      arc: 'Oblouk',
      mline: 'Multičára',
      ray: 'Polopřímka',
      xline: 'Přímka',
      ellipse: 'Elipsa',
      spline: 'Splajn',
      sketch: 'Skica',
      revcloud: 'Revizní obláček',
      rect: 'Obdélník',
      rectangle: 'Obdélník',
      polygon: 'Mnohoúhelník',
      point: 'Bod',
      divide: 'Rozdělit',
      hatch: 'Vzorová\nvýplň',
      text: 'Text',
      gradient: 'Přechod',
      move: 'Posunout',
      rotate: 'Otočit',
      copy: 'Kopírovat',
      erase: 'Vymazat',
      offset: 'Ekvidistanta',
      undo: 'Zpět',
      redo: 'Znovu',
      properties: 'Vlastnosti',
      quickSelect: 'Výběr podle\nkritérií',
      find: 'Hledat',
      countList: 'Počet',
      drawingUnits: 'Jednotky\nvýkresu',
      attachDwg: 'Připojit\nDWG',
      attachImage: 'Připojit\nobrázek',
      insert: 'Vložit',
      editAttributes: 'Upravit\nvlastnosti',
      defineAttribute: 'Definovat\nvlastnost',
      agent: 'CAD\nAgent'
    }
  },
  verticalToolbar: {
    chrome: {
      collapse: 'Sbalit panel nástrojů',
      expand: 'Rozbalit panel nástrojů',
      moreOverflow: 'Další nástroje',
      move: 'Přetažením přesunete (dvojklikem obnovíte)',
      layoutMenu: 'Rozložení panelu nástrojů',
      vertical: 'Svisle',
      horizontal: 'Vodorovně',
      resetPosition: 'Obnovit polohu'
    },
    measure: {
      text: 'Měření',
      description: 'Nástroje pro měření'
    },
    measureDistance: {
      text: 'Vzdálenost',
      description: 'Změří vzdálenost mezi dvěma body'
    },
    measureContinuous: {
      text: 'Spojité',
      description:
        'Měří řetězené vzdálenosti postupným zadáváním bodů, dokud nestisknete Enter nebo Zrušit'
    },
    measureAngle: {
      text: 'Úhel',
      description: 'Změří úhel mezi dvěma čarami se společným vrcholem'
    },
    measureArea: {
      text: 'Plocha',
      description: 'Změří plochu mnohoúhelníku'
    },
    measureArc: {
      text: 'Oblouk',
      description: 'Změří délku oblouku určeného třemi body'
    },
    measurePoint: {
      text: 'Bod',
      description: 'Změří souřadnice X/Y vybraného bodu'
    },
    measurementPanel: {
      text: 'Panel měření',
      description: 'Otevře paletu měření'
    },
    clearMeasurements: {
      text: 'Vymazat',
      description: 'Odstraní všechna měření z aktuální tiskové stránky'
    },
    measurementImport: {
      text: 'Importovat',
      description: 'Importuje měření ze sidecar JSON souboru'
    },
    measurementExport: {
      text: 'Exportovat',
      description: 'Exportuje měření do sidecar JSON souboru'
    },
    annotation: {
      text: 'Revize',
      description: 'Nástroje kontroly'
    },
    layer: {
      text: 'Hladiny',
      description: 'Spravuje hladiny'
    },
    text: {
      text: 'Text (MText)',
      description: 'Vytvoří ve výkresu víceřádkovou textovou poznámku'
    },
    pan: {
      text: 'Posun',
      description: 'Posune pohled beze změny směru pohledu a zvětšení'
    },
    markupPanel: {
      text: 'Panel poznámek',
      description: 'Otevře paletu poznámek'
    },
    markupText: {
      text: 'Text',
      description: 'Umístí textovou poznámku'
    },
    markupCloud: {
      text: 'Obláček',
      description: 'Vytvoří obláčkovou poznámku'
    },
    markupRect: {
      text: 'Obdélník',
      description: 'Vytvoří obdélníkovou poznámku'
    },
    markupCircle: {
      text: 'Kružnice',
      description: 'Vytvoří kruhovou poznámku'
    },
    markupArrow: {
      text: 'Šipka',
      description: 'Vytvoří šipkovou poznámku'
    },
    markupLine: {
      text: 'Úsečka',
      description: 'Vytvoří liniovou poznámku'
    },
    markupCallout: {
      text: 'Odkaz',
      description: 'Vytvoří odkazovou poznámku'
    },
    markupStamp: {
      text: 'Razítko',
      description: 'Umístí razítko'
    },
    markupImport: {
      text: 'Importovat',
      description: 'Importuje poznámky ze sidecar JSON souboru'
    },
    markupExport: {
      text: 'Exportovat',
      description: 'Exportuje poznámky do sidecar JSON souboru'
    },
    markupColor: {
      text: 'Barva',
      description: 'Nastaví barvu nových poznámek'
    },
    markupFontSize: {
      text: 'Výška textu',
      description:
        'Otevře nastavení výšky textu poznámek (přizpůsobit obrazovce nebo světová výška)',
      fit: 'Fit',
      wcs: 'WCS'
    },
    measurementColor: {
      text: 'Barva',
      description:
        'Nastaví barvu vybraného měření, nebo měření, která přidáte příště'
    },
    measurementFontSize: {
      text: 'Výška textu',
      description:
        'Otevře nastavení výšky textu vybraného měření, nebo měření, která přidáte příště',
      fit: 'Fit',
      wcs: 'WCS'
    },
    showMarkup: {
      text: 'Zobrazit',
      description: 'Zobrazí poznámky'
    },
    hideMarkup: {
      text: 'Skrýt',
      description: 'Skryje poznámky'
    },
    showMeasurements: {
      text: 'Zobrazit',
      description: 'Zobrazí měření'
    },
    hideMeasurements: {
      text: 'Skrýt',
      description: 'Skryje měření'
    },
    clearMarkups: {
      text: 'Vymazat',
      description: 'Vymaže všechny poznámky na aktuální tiskové stránce'
    },
    select: {
      text: 'Vybrat',
      description: 'Vybírá objekty'
    },
    switchBg: {
      text: 'Pozadí',
      description: 'Přepne pozadí výkresu mezi bílým a černým',
      disabledInReadingMode:
        'Nedostupné v režimu čtení (bílé plátno je pevné)'
    },
    zoom: {
      text: 'Zoom',
      description: 'Nástroje zoomu: uložený pohled, rozsah, chytrý rozsah a okno'
    },
    zoomSaved: {
      text: 'Uložený',
      description:
        'Obnoví uložený pohled AutoCAD (VPORT / limity tiskové stránky) nebo pohled při otevření'
    },
    zoomToExtent: {
      text: 'Rozsah',
      description: 'Zvětší na maximální rozsah všech objektů'
    },
    zoomSmartExtents: {
      text: 'Chytrý',
      description:
        'Zvětší na dominantní geometrický shluk a ignoruje vzdálené odlehlé objekty'
    },
    zoomToBox: {
      text: 'Okno',
      description: 'Zvětší na oblast určenou obdélníkovým oknem'
    }
  },
  statusBar: {
    setting: {
      tooltip: 'Nastavení zobrazení',
      commandLine: 'Příkazový řádek',
      coordinate: 'Souřadnice',
      entityInfo: 'Informace o objektu',
      languageSelector: 'Volba jazyka',
      ribbon: 'Pás karet',
      toolbar: 'Panel nástrojů',
      stats: 'Statistiky',
      replaceOnClick: 'Kliknutí nahradí výběr',
      continuousDraw: 'Pokračovat v kreslení (zůstat v nástroji)'
    },
    osnap: {
      tooltip: 'Uchopení objektů',
      endpoint: 'Koncový bod',
      midpoint: 'Střed úsečky',
      center: 'Střed',
      node: 'Uzel',
      quadrant: 'Kvadrant',
      intersection: 'Průsečík',
      insertion: 'Bod vložení',
      nearest: 'Nejbližší'
    },
    pointStyle: {
      tooltip: 'Změnit styl bodu'
    },
    fullScreen: {
      on: 'Vypnout režim celé obrazovky',
      off: 'Zapnout režim celé obrazovky'
    },
    dynamicInput: {
      on: 'Vypnout dynamické zadávání',
      off: 'Zapnout dynamické zadávání'
    },
    lineWidth: {
      on: 'Skrýt tloušťky čar',
      off: 'Zobrazit tloušťky čar'
    },
    operationProfile: {
      simple: 'Jednoduchý',
      cad: 'CAD',
      simpleTooltip:
        'Jednoduché ovládání: kliknutí nahradí výběr a po každém kreslení se vrátí nástroj Výběr. Nástroje jednou klávesou (V Výběr / H Posun / L Úsečka / R Obdélník / T Text; posun tažením s podrženým mezerníkem). Kliknutím přepnete na ovládání CAD (klasické)',
      cadTooltip:
        'Ovládání CAD (klasické): každé kliknutí přidá do výběru a kreslicí příkazy pokračují až do Enter / Esc. Kliknutím přepnete na jednoduché ovládání'
    },
    orthoMode: {
      on: 'Vypnout režim ortho',
      off: 'Zapnout režim ortho'
    },
    polarTracking: {
      on: 'Vypnout polární trasování',
      off: 'Zapnout polární trasování'
    },
    theme: {
      dark: 'Přepnout na světlý motiv',
      light: 'Přepnout na tmavý motiv'
    },
    warning: {
      font: 'Následující fonty nebyly nalezeny!'
    },
    notification: {
      tooltip: 'Zobrazit oznámení'
    },
    export: {
      tooltip: 'Exportovat obrázek jako PNG'
    },
    modelTab: 'Plátno',
    moreLayouts: 'Další tiskové stránky'
  },
  toolPalette: {
    entityProperties: {
      tab: 'Vlastnosti',
      title: 'Vlastnosti objektu',
      propertyPanel: {
        noEntitySelected: 'Není vybrán žádný objekt!',
        multipleEntitySelected: 'Vybráno objektů: {count}',
        propValCopied: 'Hodnota vlastnosti zkopírována',
        failedToCopyPropVal: 'Nepodařilo se zkopírovat hodnotu vlastnosti!',
        selection: 'Výběr',
        mixed: 'Různé',
        x: 'X',
        y: 'Y',
        width: 'Š',
        height: 'V',
        keepAspectHint: 'Změní velikost výběru se zachováním poměru stran',
        referencePoint: 'Referenční bod',
        anchor: {
          topLeft: 'Vlevo nahoře',
          top: 'Nahoře',
          topRight: 'Vpravo nahoře',
          left: 'Vlevo',
          center: 'Střed',
          right: 'Vpravo',
          bottomLeft: 'Vlevo dole',
          bottom: 'Dole',
          bottomRight: 'Vpravo dole'
        },
        selectOnlyType: 'Vybrat jen: {type}',
        totalLength: 'Celková délka',
        totalArea: 'Celková plocha',
        itemCount: '(počet: {count})',
        invisibleAttribute: 'Skryté pole',
        constantAttribute: 'Konstanta (nelze změnit)',
        allLocked: 'Objekty jsou v uzamčených hladinách a nelze je změnit',
        someLocked: 'Objekty v uzamčených hladinách se nezmění'
      }
    },
    layerManager: {
      tab: 'Hladiny',
      title: 'Správce hladin',
      currentLayerLabel: 'Aktuální hladina: {name}',
      searchPlaceholder: 'Hledat hladiny',
      filters: 'Filtry',
      collapseFilters: 'Sbalit filtry',
      expandFilters: 'Rozbalit filtry',
      filterAll: 'Vše',
      filterAllUsed: 'Všechny použité hladiny',
      toolbar: {
        showFilters: 'Filtry hladin',
        newFilter: 'Nový filtr',
        newFilterGroup: 'Nový skupinový filtr',
        newLayer: 'Nová hladina',
        deleteLayer: 'Smazat hladinu',
        setCurrent: 'Nastavit aktuální'
      },
      prompts: {
        newFilterTitle: 'Nový filtr',
        newFilterName: 'Zadejte název filtru',
        newFilterGroupTitle: 'Nový skupinový filtr',
        newFilterGroupName: 'Zadejte název skupinového filtru',
        newLayerTitle: 'Nová hladina',
        newLayerName: 'Zadejte název hladiny',
        confirm: 'OK',
        cancel: 'Zrušit'
      },
      messages: {
        filterCreated: 'Filtr „{name}“ byl vytvořen',
        filterExists: 'Filtr s názvem „{name}“ už existuje',
        filterCreateFailed: 'Nepodařilo se vytvořit filtr',
        layerCreated: 'Hladina „{name}“ byla vytvořena',
        layerExists: 'Hladina „{name}“ už existuje',
        layerCreateFailed: 'Nepodařilo se vytvořit hladinu',
        layerDeleted: 'Hladina „{name}“ byla smazána',
        layerDeleteFailed: 'Nepodařilo se smazat hladinu „{name}“',
        cannotDeleteLayer0: 'Hladinu „0“ nelze smazat',
        cannotDeleteCurrent: 'Aktuální hladinu nelze smazat',
        selectLayerFirst: 'Nejprve vyberte hladinu',
        setCurrentSuccess: 'Aktuální hladina nastavena na „{name}“',
        setCurrentFailed: 'Nepodařilo se nastavit aktuální hladinu'
      },
      layerList: {
        name: 'Název',
        on: 'Zapnuto',
        lock: 'Zamknout',
        plot: 'Tisk',
        color: 'Barva',
        linetype: 'Typ čáry',
        lineweight: 'Tloušťka čáry',
        transparency: 'Průhlednost',
        description: 'Popis',
        currentLayer: 'Aktuální hladina',
        newLayerPlaceholder: 'Název hladiny',
        zoomToLayer: 'Přiblíženo na zvolenou hladinu „{layer}“',
        lineWeightDefault: 'Výchozí'
      }
    },
    find: {
      tab: 'Hledat',
      title: 'Hledat',
      placeholder: 'Hledat text',
      input: 'Hledaný text',
      find: 'Hledat',
      matchCase: 'Rozlišovat velikost písmen',
      currentLayoutOnly: 'Pouze aktuální tisková stránka',
      hint: 'Stiskněte Enter pro hledání textu, víceřádkového textu, vlastností symbolů a textu v symbolech, kótách, odkazech a tabulkách v celém výkresu (všechny tiskové stránky).',
      hintLayout:
        'Stiskněte Enter pro hledání textu, víceřádkového textu, vlastností symbolů a textu v symbolech, kótách, odkazech a tabulkách na aktuální tiskové stránce.',
      noResults: 'Nebyl nalezen žádný text',
      count: 'Nalezeno: {count}',
      countLayouts: 'Nalezeno: {count} (tiskové stránky: {layouts})',
      countTruncated: 'Zobrazeno prvních {count} výsledků – upřesněte hledání',
      noDocument: 'Pro hledání otevřete výkres',
      layoutUnavailable: 'Tiskovou stránku „{layout}“ se nepodařilo otevřít',
      unnamedLayout: '(nepojmenovaná tisková stránka)',
      kind: {
        text: 'Text',
        mtext: 'Mtext',
        attribute: 'Vlastnost symbolu',
        block: 'Text symbolu',
        dimension: 'Kóta',
        leader: 'Odkaz',
        table: 'Tabulka'
      }
    },
    countList: {
      tab: 'Počet',
      title: 'Počet',
      searchPlaceholder: 'Hledat název symbolu',
      countInArea: 'Počet v oblasti',
      areaSet: 'Oblast počítání aktualizována',
      areaCleared: 'Počítám celé plátno',
      blockName: 'Symbol',
      count: 'Počet',
      empty: 'Nenalezeny žádné viditelné symboly',
      prompt: {
        firstCorner: 'Zadejte první roh oblasti počítání nebo [Celý]: ',
        secondCorner: 'Zadejte protilehlý roh: '
      }
    },
    designReview: {
      tab: 'Kontrola',
      title: 'Kontrola',
      searchPlaceholder: 'Hledat poznámky',
      empty: 'Zatím žádné poznámky',
      type: 'Typ',
      status: 'Stav',
      author: 'Autor',
      summary: 'Souhrn',
      details: 'Podrobnosti',
      closeDetails: 'Zavřít podrobnosti',
      label: 'Popisek',
      comment: 'Komentář',
      zoomTo: 'Přiblížit na',
      delete: 'Odstranit',
      clear: 'Vymazat vše',
      statusValues: {
        open: 'Otevřeno',
        question: 'Otázka',
        answered: 'Zodpovězeno',
        closed: 'Uzavřeno'
      }
    },
    measurements: {
      tab: 'Měření',
      title: 'Měření',
      empty: 'Zatím žádná měření',
      type: 'Typ',
      value: 'Hodnota',
      filterAll: 'Vše',
      delete: 'Odstranit',
      clear: 'Vymazat vše',
      typeValues: {
        distance: 'Vzdálenost',
        angle: 'Úhel',
        area: 'Plocha',
        arc: 'Oblouk',
        point: 'XY'
      }
    },
    missingResources: {
      tab: 'Zdroje',
      title: 'Chybějící / externí zdroje',
      fontTab: 'Font',
      imageTab: 'Obrázek',
      xrefTab: 'Propojené výkresy',
      attach: 'Připojit',
      attachDwg: 'Připojit DWG/DXF…',
      attachImage: 'Připojit obrázek…',
      attachImageFailed: 'Nepodařilo se připojit obrázek „{name}“',
      fileReferences: 'Odkazy na soubory',
      details: 'Podrobnosti',
      foundAt: 'Nalezeno v',
      selectReference: 'Vyberte referenci pro zobrazení podrobností',
      expandDetails: 'Rozbalit podrobnosti',
      collapseDetails: 'Sbalit podrobnosti',
      apply: 'Použít',
      applyDone: 'Náhrady použity',
      emptyFonts: 'Žádné chybějící fonty',
      emptyImages: 'Žádné chybějící obrázky',
      matchFontType: 'Shodný typ fontu (SHX / mesh)',
      missedFont: 'Chybějící font',
      replacedFont: 'Náhradní font',
      selectFont: 'Vyberte font pro nahrazení',
      selectLocalFont: 'Vyberte místní soubor fontu',
      file: 'Soubor',
      replace: 'Nahradit',
      name: 'Název',
      path: 'Uložená cesta',
      type: 'Typ',
      typeAttach: 'Připojení',
      typeOverlay: 'Překrytí',
      typeImage: 'Obrázek',
      status: 'Stav',
      statusMissing: 'Chybí',
      statusLoaded: 'Načteno',
      actions: 'Akce',
      visible: 'Viditelné',
      browse: 'Procházet…',
      fromUrl: 'URL…',
      unload: 'Uvolnit',
      load: 'Načíst',
      empty: 'V tomto výkresu nejsou žádné propojené výkresy ani obrázky',
      urlPrompt: 'Zadejte URL souboru výkresu (DWG, DXF apod.)',
      urlRequired: 'Zadejte prosím URL',
      loadFailed: 'Nepodařilo se načíst referenci „{name}“'
    },
    memoryProfile: {
      tab: 'Paměť',
      title: 'Profil paměti',
      refresh: 'Obnovit',
      collecting: 'Analyzuji paměť…',
      showPie: 'Zobrazit souhrnný graf',
      hidePie: 'Skrýt souhrnný graf',
      collectedAt: 'Získáno v {time}',
      heapUsed: 'JS halda {used} / {total}',
      estimateNote:
        'Velikosti geometrie vycházejí z byteLength bufferu. Ostatní kategorie jsou odhadnuté.',
      estimated: 'odh.',
      pieTotal: 'Započteno',
      pieAriaLabel: 'Rozdělení paměti podle kategorií',
      empty: 'Žádná data',
      missedFonts: 'Chybějící fonty',
      fontMemory: 'Paměť fontů / mtextu',
      fontMemorySummary: 'Paměť {live} (hlavní {main} · workery {workers})',
      fontStorage: 'Úložiště IndexedDB (nikoli paměť)',
      fontStorageSummary: '{count} fontů v mezipaměti · {size}',
      materialPoint: 'Bod',
      materialLine: 'Čára',
      materialFill: 'Výplň',
      materialTotal: 'Celkem',
      dataModelCounts: '{entities} entit · {objects} objektů · {total}',
      dataModelCategories: 'Podle kategorie',
      dataModelEntityTypes: 'Podle typu objektu',
      categories: {
        heap: 'JS halda',
        geometry: 'Geometrie',
        mapping: 'Mapování',
        spatial: 'Prostorový index',
        dataModel: 'Datový model',
        materials: 'Materiály',
        fonts: 'Fonty'
      },
      tabs: {
        geometry: 'Geometrie',
        spatial: 'Prostorové',
        dataModel: 'Datový model',
        materials: 'Materiály',
        fonts: 'Fonty'
      },
      columns: {
        layout: 'Tisková stránka',
        layer: 'Hladina',
        geometry: 'Geometrie',
        mapping: 'Mapování',
        entities: 'Objekty',
        rootItems: 'Kořen',
        childItems: 'Potomci',
        estimated: 'Odh. velikost',
        type: 'Typ',
        count: 'Počet',
        category: 'Kategorie',
        font: 'Font'
      }
    },
    openFileProfile: {
      tab: 'Otevření',
      title: 'Výkon otevření',
      refresh: 'Obnovit',
      copy: 'Kopírovat',
      copied: 'Data o výkonu zkopírována',
      copyFailed: 'Kopírování dat o výkonu selhalo',
      collectedAt: 'Shromážděno v {time}',
      hint: 'Automaticky po posledním otevření výkresu. OPENPROF=1 také zapíše do konzole.',
      noData: 'Zatím žádný profil. Nejprve otevřete výkres a spusťte OPENPERF.',
      empty: 'Žádná data',
      timing: 'Časování',
      progressive: 'Progresivní otevření',
      progressiveMode: 'Režim',
      progressiveOn: 'Zapnuto',
      progressiveOff: 'Vypnuto',
      midOpenPaints: 'Vykreslení během otevření',
      yields: 'Výnosy (yields)',
      cache: 'Cache renderování INSERT (top-level)',
      slowBlocks: 'Nejpomalejší miss šablon symbolů',
      total: 'Celkem',
      read: 'db.read',
      parse: 'PARSE',
      entity: 'ENTITY flush',
      convert: 'Převod scény',
      cacheHits: 'Zásahy cache',
      cacheMisses: 'Miss cache',
      cacheBuild: 'Miss build',
      cacheCompact: 'Miss compact',
      cacheHitPath: 'Hit path',
      columns: {
        stage: 'Fáze',
        duration: 'Trvání',
        share: 'Podíl',
        metric: 'Metrika',
        value: 'Hodnota',
        block: 'Symbol',
        build: 'Build',
        compact: 'Compact'
      }
    },
    blocks: {
      tab: 'Symboly',
      title: 'Symboly',
      tabCurrentDrawing: 'Aktuální výkres',
      tabRecent: 'Nedávné',
      tabFavorites: 'Oblíbené',
      tabLibraries: 'Knihovny',
      sectionCurrentDrawing: 'Symboly aktuálního výkresu',
      sectionRecent: 'Nedávno vložené symboly',
      sectionFavorites: 'Oblíbené symboly',
      sectionLibraries: 'Knihovny symbolů',
      filterPlaceholder: 'Filtrovat…',
      empty: 'Nejsou k dispozici žádné symboly',
      emptyRecent: 'Žádné nedávno vložené symboly',
      emptyFavorites: 'Žádné oblíbené symboly',
      emptyLibraries: 'Nejsou nakonfigurovány žádné knihovny',
      toggleFavorite: 'Přepnout oblíbené',
      options: 'Možnosti',
      insertionPoint: 'Vložení',
      scale: 'Měřítko',
      rotation: 'Otočení',
      angle: 'Úhel',
      autoPlacement: 'Automatické umístění',
      repeatPlacement: 'Opakovat umístění',
      explode: 'Rozložit'
    }
  },
  colorDropdown: {
    custom: 'Vlastní'
  },
  lineTypeSelect: {
    placeholder: 'Typ čáry'
  },
  colorIndexPicker: {
    color: 'Barva: ',
    colorIndex: 'Index barvy: ',
    inputPlaceholder: '0-256, BYLAYER, BYBLOCK',
    rgb: 'RGB: '
  },
  entityInfo: {
    color: 'Barva',
    layer: 'Hladina',
    lineType: 'Typ čáry'
  },
  ribbonProperty: {
    color: 'Barva',
    lineType: 'Typ čáry',
    lineWeight: 'Tloušťka čáry',
    layer: 'Hladina'
  },
  layerSelect: {
    searchPlaceholder: 'Hledat název hladiny',
    noLayerAvailable: 'Žádné hladiny nejsou k dispozici',
    noMatchedLayer: 'Žádné odpovídající hladiny',
    tooltip: {
      layer: 'Hladina',
      visibility: 'Viditelnost',
      lock: 'Uzamknout',
      lineType: 'Typ čáry',
      color: 'Barva',
      visible: 'Viditelná',
      hidden: 'Skrytá',
      locked: 'Uzamčená',
      unlocked: 'Odemčená'
    }
  },
  message: {
    loadingFonts: 'Načítám fonty…',
    loadingDwgConverter: 'Načítám převodník DWG…',
    fontsNotFound: 'Fonty {fonts} nebyly nalezeny v úložišti fontů!',
    fontsNotLoaded: 'Fonty {fonts} se nepodařilo načíst!',
    fontMissedInDrawing:
      'Font „{font}“ je potřeba pro {count} textových objektů, ale není k dispozici. Zobrazeno fontem „{replacementFont}“.',
    fontMissedReplacement: '„{font}“ (zobrazeno fontem „{replacement}“)',
    fontCached: 'Font „{font}“ byl úspěšně uložen do mezipaměti.',
    fontCacheFailed: 'Nepodařilo se uložit font „{fileName}“ do mezipaměti.',
    failedToGetAvaiableFonts: 'Nepodařilo se získat dostupné fonty z „{url}“!',
    failedToOpenFile: 'Nepodařilo se otevřít soubor „{fileName}“!',
    failedToOpenFileToast:
      'Nepodařilo se otevřít „{fileName}“. Podrobnosti najdete v centru oznámení.',
    failedToOpenFileWorkerOom:
      'Nepodařilo se otevřít „{fileName}“. Analýza selhala kvůli nedostatku dostupné paměti (LibreDWG parser). Kliknutím na {dwgParserLink} můžete zakoupit komerční DWG parser a otevírat velké výkresy bez tohoto pádu.',
    failedToOpenFileWorkerOomLink: 'tuto stránku',
    failedToOpenFileWorkerTimeout:
      'Nepodařilo se otevřít „{fileName}“. Při načítání výkresu vypršel časový limit.',
    failedToOpenFileFontLoadFailed:
      'Nepodařilo se otevřít „{fileName}“. Potřebné fonty se nepodařilo načíst.',
    failedToOpenFileLicenseExpired:
      'Nepodařilo se otevřít „{fileName}“. Licence převodníku DWG vypršela.',
    failedToOpenFileLicenseInvalid:
      'Nepodařilo se otevřít „{fileName}“. Licence převodníku DWG chybí nebo je neplatná.',
    fetchingDrawingFile: 'Načítám soubor…',
    unknownEntities:
      'Tento výkres obsahuje {count} neznámých nebo nepodporovaných objektů! Tyto objekty nebudou zobrazeny.',
    tianzhengEntities:
      'Tento výkres obsahuje vlastní objekty TArch / Tianzheng (nebo podobné třetí strany) (asi {count}). V tomto prostředí je nelze plně zpracovat, takže se část obsahu nemusí zobrazit.',
    emptyProxyEntities:
      'Tento výkres obsahuje {count} vlastních objektů bez proxy grafiky! Tyto objekty nebudou zobrazeny.'
  },
  notification: {
    center: {
      title: 'Oznámení',
      clearAll: 'Vymazat vše',
      noNotifications: 'Žádná oznámení'
    },
    group: {
      fontMissed: 'Chybějící fonty',
      fontMissedSummary:
        '{count} zpráv o fontech. Kliknutím zobrazíte podrobnosti.',
      unsupportedEntities: 'Nepodporované objekty',
      unsupportedEntitiesSummary:
        '{count} zpráv o načítání. Kliknutím zobrazíte podrobnosti.',
      genericSummary: '{count} zpráv. Kliknutím zobrazíte podrobnosti.'
    },
    time: {
      justNow: 'Právě teď',
      minutesAgo: 'před {count} minutou | před {count} minutami',
      hoursAgo: 'před {count} hodinou | před {count} hodinami',
      daysAgo: 'před {count} dnem | před {count} dny'
    },
    title: {
      failedToOpenFile: 'Nepodařilo se otevřít soubor',
      failedToOpenFileWorkerOom: 'Nedostatek paměti',
      failedToOpenFileWorkerTimeout: 'Vypršel časový limit otevření',
      failedToOpenFileFontLoadFailed: 'Načtení fontu selhalo',
      failedToOpenFileLicenseExpired: 'Licence vypršela',
      failedToOpenFileLicenseInvalid: 'Neplatná licence',
      fontNotFound: 'Font nenalezen',
      fontNotLoaded: 'Font nenačten',
      parsingWarning: 'Problémy při načítání výkresu',
      systemMessage: 'Systémová zpráva',
      systemWarning: 'Systémové varování',
      systemError: 'Systémová chyba',
      systemInfo: 'Systémové informace'
    }
  }
}
