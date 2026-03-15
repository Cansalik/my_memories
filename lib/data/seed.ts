import type { Memory, GalleryPhoto, GalleryVideo, SongConfig } from "@/types";

export const seedMemories: Memory[] = [
  { id: "1", title: "İlk Tanışma", date: "3 Mart 2022", description: "Hayatımın en güzel sürpriziydi. O gün seni gördüğümde, sanki yıldızlar hizaya geldi ve kalbim bir an durdu. Gülüşün her şeyi değiştirdi." },
  { id: "2", title: "İlk Kahvemiz", date: "15 Mart 2022", description: "O küçük kafede geçirdiğimiz saatler, yıllar gibi geldi. Fincanlarımız soğurken biz konuşmayı bırakamadık. O an dünyada sadece ikimiz vardık." },
  { id: "3", title: "İlk Film Gecesi", date: "2 Nisan 2022", description: "Filmi izledik mi, yoksa birbirimizi mi izledik, hâlâ bilmiyorum. Ama o sıcaklık, o sessizlik içindeki anlayış — hepsini hatırlıyorum." },
  { id: "4", title: "İlk Tatilimiz", date: "14 Eylül 2022", description: "Birlikte geçirdiğimiz en güzel günlerden biriydi. Denizin sesi, gün batımının altın rengi ve seninle her şey mükemmeldi." },
  { id: "5", title: "Nişan Günümüz", date: "14 Şubat 2023", description: "Ellerini tuttuğumda ve gözlerinin içine baktığımda, tüm cevapları buldum. Evet, seninle. Her zaman seninle." },
  { id: "6", title: "İlk Kış Yürüyüşü", date: "12 Ocak 2023", description: "Kar altında, soğukta, ellerin elimde — kalbim hiç bu kadar sıcak olmamıştı." },
  { id: "7", title: "Doğum Günü Sürprizi", date: "7 Haziran 2022", description: "Yüzündeki o şaşkın ve mutlu ifadeyi hiç unutamam." },
  { id: "8", title: "İlk Yemek Pişirme", date: "30 Mayıs 2022", description: "Mutfak bir savaş alanına döndü ama gülüşlerimiz hiç bitmedi." },
];

export const seedPhotos: GalleryPhoto[] = [
  { id: "1", url: "", caption: "İlk Tatilimiz", date: "Eylül 2022", featured: true, sort_order: 1 },
  { id: "2", url: "", caption: "Nişan Gecesi", date: "Şubat 2023", featured: true, sort_order: 2 },
  { id: "3", url: "", caption: "Kış Masalı", date: "Ocak 2023", featured: true, sort_order: 3 },
  { id: "4", url: "", caption: "Kahve Sabahları", date: "Mart 2022", featured: false, sort_order: 4 },
  { id: "5", url: "", caption: "Gün Batımı", date: "Nisan 2022", featured: false, sort_order: 5 },
  { id: "6", url: "", caption: "Birlikte", date: "Mayıs 2022", featured: false, sort_order: 6 },
  { id: "7", url: "", caption: "Yağmurlu Bir Gün", date: "Haziran 2022", featured: false, sort_order: 7 },
  { id: "8", url: "", caption: "Doğum Günü Gecesi", date: "Haziran 2022", featured: false, sort_order: 8 },
  { id: "9", url: "", caption: "Sahil Yürüyüşü", date: "Temmuz 2022", featured: false, sort_order: 9 },
  { id: "10", url: "", caption: "Sonbahar Parkı", date: "Ekim 2022", featured: false, sort_order: 10 },
  { id: "11", url: "", caption: "Kar Altında", date: "Aralık 2022", featured: false, sort_order: 11 },
  { id: "12", url: "", caption: "Yıl Dönümü", date: "Mart 2023", featured: false, sort_order: 12 },
];

export const seedVideos: GalleryVideo[] = [
  { id: "1", src: "/videos/video-1.mp4", title: "İlk Tatil Anıları", date: "Eylül 2022", duration: "2:14", featured: true, sort_order: 1 },
  { id: "2", src: "/videos/video-2.mp4", title: "Nişan Günümüz", date: "Şubat 2023", duration: "3:42", featured: true, sort_order: 2 },
  { id: "3", src: "/videos/video-3.mp4", title: "Kış Yürüyüşü", date: "Ocak 2023", duration: "1:55", featured: true, sort_order: 3 },
  { id: "4", src: "/videos/video-4.mp4", title: "Doğum Günü Sürprizi", date: "Haziran 2022", duration: "4:08", featured: false, sort_order: 4 },
  { id: "5", src: "/videos/video-5.mp4", title: "Sahil Günbatımı", date: "Temmuz 2022", duration: "0:58", featured: false, sort_order: 5 },
  { id: "6", src: "/videos/video-6.mp4", title: "Yıl Dönümü Akşamı", date: "Mart 2023", duration: "3:20", featured: false, sort_order: 6 },
];

export const seedSong: SongConfig = {
  id: "default",
  youtube_id: "",
  title: "Bizim Şarkımız",
  artist: "Neşet & Müzeyyen",
};
