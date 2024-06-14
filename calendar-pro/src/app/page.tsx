import Calendar from "@/components/Calendar";
import DisplayView from "@/components/DisplayView";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="h-[100dvh]">
      <Header />
      <main className="relative h-full font-[300] flex flex-col md:flex-row items-center md:items-start justify-stretch p-4 gap-4">
        <div className="flex flex-col gap-8 justify-center items-center">
          <Calendar />
        </div>
        <DisplayView />
      </main>
    </div>
  );
}
