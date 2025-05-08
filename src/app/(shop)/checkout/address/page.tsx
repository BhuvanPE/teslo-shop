import { Title } from '@/components';
import { AddressForm } from './iu/AddressForm';
import { getCountries } from '@/actions/country/get-countries';
import { getUserAddress } from '@/actions/address/getUserAddress';
import { auth } from '@/auth';

// se puede usar revalidación si la data no varia muy seguido

export default async function AddressPage() {
    const session = await auth()

    const countries = await getCountries()

    if (!session?.user)
        return (
            <div>
                <h3 className='text-5xl'>500 - No hay sesión de usuario</h3>
            </div>
        )

    const userAddress = await getUserAddress(session.user.id)

    return (
        <div className="flex flex-col sm:justify-center sm:items-center mb-72 px-10 sm:px-0">

            <div className="w-full  xl:w-[1000px] flex flex-col justify-center text-left">

                <Title title="Dirección" subtitle="Dirección de entrega" />
                <AddressForm countries={countries} userAddress={userAddress} />

            </div>

        </div>
    );
}