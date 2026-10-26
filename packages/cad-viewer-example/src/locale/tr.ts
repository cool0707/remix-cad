export default {
  command: {
    ACAD: {
      quit: {
        description: 'Uygulamadan çıkar ve tüm açık çizimleri kapatır'
      },
      exit: {
        description: 'Uygulamadan çıkar ve tüm açık çizimleri kapatır'
      }
    }
  },

  example: {
    fileUpload: {
      title: 'Görüntülenecek CAD Dosyasını Seçin',
      subtitle: 'DWG, DXF, JWW / JWC (Jw_cad) veya SXF çizimlerini görüntüleyiciye aktarın',
      fontCdnNotice:
        'Japanese fonts (BIZ UD) are bundled with this viewer. Fonts for other scripts (Chinese, Korean, Latin substitutes, etc.) are downloaded from Google Fonts when a drawing needs them; if Google Fonts is unreachable, that text may not display correctly.',
      newDrawing: 'Yeni Çizim',
      or: 'veya',
      dropFile: 'Dosyayı bırakın veya',
      browse: 'göz atın',

      openOptions: 'Açma seçenekleri',

      initialView: 'İlk görünüm',
      auto: 'Otomatik',
      autoHint: 'Erişim moduna göre',
      extents: 'Kapsam',
      extentsHint: 'Çizimi sığdır',
      saved: 'Kayıtlı',
      savedHint: 'AutoCAD kayıtlı görünümü',
      limits: 'Sınırlar',
      limitsHint: 'Çizim sınırları / kağıt',

      accessMode: 'Erişim modu',
      read: 'Oku',
      readHint: 'Yalnızca görüntüle',
      review: 'Yorumlar',
      reviewHint: 'Görüntüle ve yorum yap',
      write: 'Yaz',
      writeHint: 'Tam erişim',

      textRendering: 'Metin oluşturma',
      worker: 'İşçi',
      workerHint: 'Daha hızlı, daha fazla bellek',
      mainThread: 'Ana iş parçacığı',
      mainThreadHint: 'Daha yavaş, daha az bellek',

      progressive: 'Aşamalı',
      progressiveRendering: 'Aşamalı oluşturma',
      on: 'Açık',
      progressiveOnHint:
        'Ayrıştırma/dönüşüm bitene kadar arayüzü kilitle; sonra sahne yüklenirken pan/zoom',
      off: 'Kapalı',
      progressiveOffHint: 'Varlık ve metin geometrisi dönüşene kadar bekle',

      nonPlottable: 'Yazdırılamayan',
      nonPlottableLayers: 'Yazdırılamayan katmanlar',
      hide: 'Gizle',
      hideHint: 'Web görüntüleyici varsayılanı',
      show: 'Göster',
      showHint: 'AutoCAD düzenleyici semantiği',

      curveQuality: 'Eğri kalitesi',
      curveDraft: 'Bellek',
      curveDraftHint: 'Daha az tepe noktası, daha küçük dosyalar',
      curveStandard: 'Standart',
      curveStandardHint: 'Dengeli (daire başına 100 kenar)',
      curveHigh: 'Kalite',
      curveHighHint: 'Daha pürüzsüz eğriler, daha fazla bellek',

      paperSpaceBackground: 'Kağıt arka planı',
      paperSpaceWhite: 'Beyaz',
      paperSpaceWhiteHint: 'Masaüstü CAD / yazdırma önizlemesi',
      paperSpaceBlack: 'Siyah',
      paperSpaceBlackHint: 'Web görüntüleyici tercihi',

      export: 'Dışa aktarma',
      exportEnable: 'Etkin',
      exportEnableHint: 'DXF/HTML/PDF/SVG/PNG dışa aktarmaya izin ver',
      exportDisable: 'Devre dışı',
      exportDisableHint: 'Dışa aktarma komutlarını ve File menü öğelerini gizle',

      invalidFileType:
        'Geçersiz dosya türü. Lütfen DWG, DXF, JWW, JWC veya SXF (SFC / P21 / SFZ / P2Z) dosyaları yükleyin.'
    }
  }
}
