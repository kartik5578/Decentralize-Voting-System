import './App.css';
import { ethers } from 'ethers';
import {marketplace_abi} from "./abi.js"
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useState } from 'react';


function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState("");
  const [votingsys, setVotingsys]= useState({});
  const [cadaddres, setCadAddress] = useState("");
  const [votedcadadd, setVotedCad] = useState("")
  const [voter, SetVoter] = useState("");
  const [start, setStart] = useState(false);
  const [result, setResult] = useState("");
  
// metamask connection
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload()
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setLoading(false)
        let voting = "0xe7F1ECE0258503089400eAb4134302255c3F9cb9";
       

        const votecontract = new ethers.Contract(
          voting,
          marketplace_abi,
          signer
        );

       

        //console.log(contract);
        setVotingsys(votecontract);
     
       
      } else {
        console.error("Metamask is not installed");
      }
    };

    provider && loadProvider();
  }, []);

  //variable setting
  const Cadchange = (event)=>{
      setCadAddress(event.target.value)
  }

  const Resvoter = (event)=>{
    SetVoter(event.target.value)
  }

  const votedcad = (event)=>{
    setVotedCad(event.target.value)
  }


  // blockchain funtion calls

  //adding cadidate
  const handleCad = async (event) => {
    event.preventDefault(); // Prevents form submission and page reload
    try {
      console.log("into the function");
      const tx1 = await votingsys.setCandidate(cadaddres);
      await tx1.wait();
      alert("Transaction successful! Candidate has been set.");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("You are not the owner");
    }
  };

  //function to start the election
  const startelc = async () => {
    if(!start){
      try {
        const tx1 = await votingsys.startElection();
        await tx1.wait();
        alert("Election has started succesfully");
        setStart(true);
      } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed. Please try again.");
      }
    }else{
        alert("election is already started or you are not the owner");
    }
  };

   //function to end the election
   const endelc = async () => {
    if(start){
      try {
        const tx1 = await votingsys.stopElection();
        await tx1.wait();
        alert("Election has Ended succesfully");
        setStart(true);
      } catch (error) {
        console.error("Transaction failed:", error);
        alert("Transaction failed. Please try again.");
      }
    }else{
        alert("election is already Ended or you are not the owner");
    }
  };

  //register user
  const ResUser = async (event) => {
    event.preventDefault(); // Prevents form submission and page reload
    try {
      console.log("into the function");
      const tx1 = await votingsys.registerUser(voter);
      await tx1.wait();
      alert("Transaction successful! Candidate has been set.");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("You are not the owner");
    }
  };

//user vote
  const userVoted = async (event) => {
    event.preventDefault();
    try {
      console.log(votedcadadd)
      const tx1 = await votingsys.AddVote(votedcadadd);
      await tx1.wait();
      alert("Transaction successful! User has votted succesfully.");
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("you have not voted");
    }
  };

  //result
// const getres = async () =>{
//   if(!start){
//       const res = await votingsys.Result().wait();
//       setResult(res);
//   }else{
//     alert("Election is still going on")
//   }
// }

const getres = async () => {
  try {
    if (!start) {
      const res = await votingsys.Result(); // Call the function directly
      setResult(res); // Save the result in state or process it
    } else {
      alert("Election is still going on");
    }
  } catch (error) {
    console.error("Error fetching result:", error);
  }
};

  



  return (
    
    <div className="App">
        <div class="container">
    <h1>Decentralized Voting System</h1>


    <div class="admin-section">
  <h2>Admin Controls</h2>
  <form id="candidate-form" onSubmit={handleCad}>
    <input onChange={Cadchange} type="text" id="candidateAddress" required placeholder="Candidate Address" />
    <button type="submit">Add Candidate</button>
  </form>
 <div id="btnse">
 <button onClick={startelc} id="startElectionBtn">Start Election</button>
  <button onClick={endelc} id="stopElectionBtn">Stop Election</button>
 </div>
 
</div>

    <div class="voter-section">
      <h2>Voter Registration & Voting</h2>
      <form id="voter-form" onSubmit={ResUser}>
        <input onChange={Resvoter} type="text" id="voterAddress" placeholder="Voter Address"/>
        <button type="submit">Register Voter</button>
      </form>

      <form id="vote-form" onSubmit={userVoted}>
        <input onChange={votedcad} type="text" id="voteCandidateAddress" placeholder="Candidate Address"/>
        <button type="submit">Vote</button>
      </form>
    </div>

  
    <div class="result-section">
      <h2>Election Results</h2>
      <button onClick={getres} id="getResultBtn">Get Result</button>
      <p id="result">
        {
          result ? (<p>{result}</p>) : (<p></p>)
        }
      </p>
    </div>
  </div>
    </div>
    
  );
}

export default App;
