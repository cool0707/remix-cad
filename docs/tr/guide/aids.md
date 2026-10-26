---
title: Yardımcı Görüntüleme
---

# Yardımcı Görüntüleme

Yardımcı görüntüleme, noktaları, yönleri ve nesneleri daha kesin bir şekilde konumlamanıza yardımcı olur.

## Nesne Yakalama (OSNAP)

Nesne yakalama, imleç yakalanabilir bir konuma yaklaştığında otomatik olarak o noktaya yapışır ve bir yakalama işareti gösterir.

Desteklenen yakalama modları:

| Mod | İşaret | Açıklama |
|---|---|---|
| EndPoint | Dikdörtgen | Çizgi parçası uç noktası |
| MidPoint | Üçgen | Çizgi parçası orta noktası |
| Center | Daire | Çember/yay/elips merkezi |
| Quadrant | Baklava dilimi | Çemberin dört kadran noktası |
| Nearest | Çapraz | İmlece en yakın nokta |
| Intersection | × | İki çizginin kesişim noktası |

OSNAP, durum çubuğundan hızlıca açılıp kapatılabilir; tıklayarak ayrıntılı yapılandırma paneline girip etkinleştirilecek yakalama modlarını seçebilirsiniz.

## Dik Mod (ORTHO)

Açıldığında, bir sonraki çizginin yalnızca yatay veya dikey yönde çizilmesi kısıtlanır. Eksen hizalı dikdörtgenler, eşkenar üçgenler vb. çizmek için uygundur.

- Kısayol: `F8` (destekleniyorsa)
- Durum çubuğundan anahtarı değiştir

## Açı Yakalama (POLAR)

Açıldığında, önceki noktadan imlece olan yön ayarlanan açının katlarına yakalanır. Durum çubuğundaki düğmenin yanındaki aşağı oktan yakalama açısını seçebilirsiniz: her 90°, 45°, 30°, 22,5°, 18°, 15°, 10° veya 5° (varsayılan her 90°).

Açı yakalama kapalıyken bile `Shift` basılı tutulduğunda aynı açılara yakalanır.

Dik mod da açıksa, yatay ve dikey yönler de yakalama yönlerine eklenir.

CAD yazılımlarında "kutupsal izleme" (AutoCAD'de POLAR) olarak bilinen işlevdir; açı POLARANG sistem değişkeninde saklanır.

## Dinamik Girdi (DYN)

İmlecin yakınında yüzen bir giriş kutusu görüntülenir. Komut yürütülürken, komut satırını kullanmadan doğrudan giriş kutusuna değerler (mesafe, açı vb.) yazılabilir.

## Lastik Bant Önizleme

Neredeyse tüm çizim komutları, imleci hareket ettirdiğinizde "önceki nokta" ile "geçerli imleç" arasında geçici bir önizleme çizgi parçası (lastik bant) gösterir; bu, yön ve uzunluğu değerlendirmenize yardımcı olur.
