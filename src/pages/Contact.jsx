import { assets } from '../assets/assets'
import Title from '../components/Title'

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"Contact"} text2={"Us"} />
      </div>
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img src={assets.contact_img} className='w-full md:max-w-[480px]' alt="" />
        <div className="flex flex-col justify-center gap-6 items-start">
          <p className='font-semibold text-xl text-gray-600'>Our Store</p>
          <p className='text-gray-600'>1234 Street Name, City, State, 12345</p>
          <p className='text-gray-600'>Email: info@ourstore.com</p>
          <p className='text-gray-500 text-xl font-semibold'>Careers at Forever</p>
          <p className='text-gray-600'>Learn more about our teams and job openings</p>
          <button className='bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all'>Explore jobs</button>
        </div>
      </div>
    </div>
  )
}

export default Contact