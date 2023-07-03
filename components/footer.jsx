import Link from "next/link"; 

const footer = () => {
  return (
    <>

      <footer className="dark:bg-jacarta-900 page-footer bg-light-base">
        <div className="container">
          <div className="grid grid-cols-12 gap-x-7  p-10 md:grid-cols-12 text-center">
            <div className="col-span-4">
              Flow ad space
            </div>
            <div className="col-span-4">
              Flow ad space
            </div>
            <div className="col-span-4">
              Flow ad space
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default footer;
