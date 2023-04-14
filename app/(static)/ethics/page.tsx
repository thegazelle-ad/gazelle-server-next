export const config = {
    runtime: 'experimental-edge',   // this is a pre-requisite   
    regions :  [ 'fra1' ] ,   // only execute this function on iad1
};

import Image from "next/image";

async function getData() {
    const text = Array.from({ length: 10 }).map((_, i) => (
        <p key={i}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        Nullam euismod, nisl nec tincidunt lacinia, nunc est
        tincidunt nunc, eget aliquam massa nisl eget dolor.
        Nullam euismod, nisl nec tincidunt lacinia, nunc est
        </p>
    ));

    return { title: 'About', body: text };
}


export default async function Page() {    
    const { body, title } = await getData();

    return (
        <div>
         <header className='flex flex-col m-w-4xl mx-auto'>
          <h1 className='text-center font-medium uppercase text-2xl'>
            {title}
          </h1>
            <Image
              priority
              src="/images/placeholder-img.jpg"
              height={1000}
              width={1000}
              // className={"rounded-xl w-64 h-64"}
              alt="placeholder"
            />
        </header>
        <main>
          {/* create ten paragraph elements of lorem ipsum */}
            {body}
        </main>
        </div>
    );
}