import HeaderBox from "@/components/HeaderBox";
import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1;

  // Attempt to get the logged-in user
  const loggedIn = await getLoggedInUser();
  if (!loggedIn) {
    return <div>User not logged in</div>;
  }

  // Attempt to get the accounts for the logged-in user
  const accounts = await getAccounts({
    userId: loggedIn.$id,
  });
  if (!accounts || !accounts.data || accounts.data.length === 0) {
    return <div>No accounts available</div>;
  }

  const accountsData = accounts.data;
  const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

  // Attempt to get the account details
  const account = await getAccount({ appwriteItemId });
  if (!account) {
    return <div>Account not found</div>;
  }

  return (
    <section className="home">
      <div className="home-content">
        <header className="home-header">
          <HeaderBox
            type="greeting"
            title="Welcome"
            user={loggedIn.firstName || "Guest"}
            subtext="Access and manage your account and transactions efficiently."
          />

          <TotalBalanceBox
            accounts={accountsData}
            totalBanks={accounts.totalBanks}
            totalCurrentBalance={accounts.totalCurrentBalance}
          />
        </header>

        <RecentTransactions
          accounts={accountsData}
          transactions={account.transactions}
          appwriteItemId={appwriteItemId}
          page={currentPage}
        />
      </div>

      <RightSidebar
        user={loggedIn}
        transactions={account.transactions}
        banks={accountsData.slice(0, 2)}
      />
    </section>
  );
};

export default Home;
