import { cartContext } from "@/contexts/cart-context";
import React, { useContext, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";
import { BANK_URL } from "@/lib/url-helper";
const Payment = (): JSX.Element => {
  const { toast } = useToast();
  const router = useRouter();
  const cartCtx = useContext(cartContext);
  const [loading, setIsloading] = useState<boolean>(false);
  function calculateTotalPrice() {
    let sum = 0;
    cartCtx?.products.map((element) => {
      return (sum += element.productQuantity * element.productPrice);
    });

    return sum;
  }

  async function payWithBank() {
    setIsloading(true);
    const userSession = await getSession();
    if (!userSession) {
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: "Try again..",
      });
      setIsloading(false);
      return;
    }

    try {
      const response = await fetch(
        `${BANK_URL}/api/transactions/transact-money`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: userSession.user?.email,
            //@ts-ignore
            userId: userSession.user!.user_id,
            amount: calculateTotalPrice(),
          }),
        }
      );

      const pResponse = await response.json();
      console.log(pResponse);
      if (pResponse.status === "success") {
        toast({
          title: "Transaction Successful!",
          description: "You will be shortly redirected...",
        });
        setIsloading(false);
        setTimeout(() => {
          router.push("/orders");
        }, 3000);
        return;
      } else if (pResponse.status === "error") {
        setIsloading(false);
        toast({
          variant: "destructive",
          title: "Transaction failed",
          description: pResponse.message || "Try again..",
        });
        return;
      }
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      toast({
        variant: "destructive",
        title: "Transaction failed",
        description: "Try again..",
      });
      console.log(error);
    }
  }
  return (
    <div>
      <section className="border-2 border-red-400 lg:h-52 m-4 lg:sticky lg:top-1 rounded">
        <p className="text-orange-600 font-bold text-3xl text-center mb-2 lg:p-4">
          Grand Total
        </p>
        <p className="text-white bg-orange-600 text-3xl text-center font-bold">
          {calculateTotalPrice()} $
        </p>
      </section>
      <section>
        <button
          disabled={loading}
          onClick={payWithBank}
          className="bg-green-600 disabled:bg-slate-600 text-white text-2xl rounded-md font-bold p-4 block shadow-lg shadow-slate-600 mx-auto mb-8  hover:shadow-xl hover:shadow-slate-600 transition-all active:bg-green-400"
        >
          {loading ? "Contacting Bank" : "Pay with weBank"}
        </button>
      </section>
      <Toaster />
    </div>
  );
};

export default Payment;