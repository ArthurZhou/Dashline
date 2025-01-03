export let currentPage = "Home";

export default function Home() {
  currentPage = "Home"
  return (
    <div className="p-7">
      <div id="searchArea" />
    </div>
  );
}

export function Settings() {
  currentPage = "Settings"
  return (
    <div></div>
  );
}
