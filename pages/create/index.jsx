import React, { useContext, useState } from "react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional
import { FileUploader } from "react-drag-drop-files";
import Meta from "../../components/Meta";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { TransitionProps } from "@mui/material/transitions";
import { NFTStorage, File } from "nft.storage";
import { Configuration, OpenAIApi } from "openai";
import { toast } from "react-toastify";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../components/firebase";
import { AuthContext } from "../../context/AuthConext";
import { CadenceContext } from "../../context/CadenceContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Create = () => {
  const fileTypes = [
    "JPG",
    "PNG",
    "GIF",
    "SVG",
    "MP4",
    "WEBM",
    "MP3",
    "WAV",
    "OGG",
    "GLB",
    "GLTF",
  ];
  const [file, setFile] = useState("");
  const [startDate, setStartDate] = React.useState(dayjs(new Date()));
  const [endDate, setEndDate] = React.useState(dayjs(new Date()));
  const [nftname, setNftName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setpPrice] = useState(1);
  const [image, setImage] = useState({});
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [loadingcreate, setLoadingCreate] = useState(false);
  const [place, setPlace] = useState("");
  const [sortActive, setsortActive] = useState(1);
  const [sortFilterText, setSortFilterText] = useState("");
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const authContex = useContext(AuthContext);
  const { user } = authContex;

  const cadenceContext = useContext(CadenceContext);
  const { createNFT } = cadenceContext;

  const NFT_STORAGE_KEY = process.env.NEXT_APP_NFT_STORAGE_KEY;

  const configuration = new Configuration({
    apiKey: process.env.NEXT_APP_OPEN_AI_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const handleChange = async (file) => {
    setLoading(true);
    const filename = file.name;
    const img = new File([file], file.name, { type: file.type });
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
    const res = await nftstorage.store({
      image: img,
      name: filename,
      description: filename,
    });
    const url = res.data.image.href.replace(
      "ipfs://",
      "https://nftstorage.link/ipfs/"
    );
    setFile(url);
    setImage(img);
    setLoading(false);
  };
  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  const handleInput = (e, text) => {
    setPlace(text);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateNFT = async () => {
    setLoadingCreate(true);
    const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY });
    const res = await nftstorage.store({
      image: image,
      name: nftname,
      description: description,
      Price: price,
      StartDate: dayjs(startDate).format("LL"),
      EndDate: dayjs(endDate).format("LL"),
      place: place
    });

    let metadataUrl = `https://${res.ipnft}.ipfs.nftstorage.link/metadata.json`;

    let nftId = await createNFT(price, metadataUrl, nftname);

    if (nftId) {
      const data = {
        Nftname: nftname,
        Description: description,
        Creator: user && user?.addr,
        Photo: file,
        Price: price,
        StartDate: dayjs(startDate).format("LL"),
        EndDate: dayjs(endDate).format("LL"),
        CreatedAt: new Date(),
        nftId: nftId,
        place: place
      };
      await addDoc(collection(db, "CreateNFTs"), data);
      setUpdate(!update);
      toast.success("NFT successfully Created!!");
      setFile("");
      setNftName("");
      setDescription("");
      setpPrice("");
      setLoadingCreate(false);
    }
  };

  const data = [
    {
      id: 1,
      text: "Stadium",
    },
    {
      id: 2,
      text: "Art Gallery",
    },
    {
      id: 3,
      text: "Auditorium",
    },
  ];

  const generateContent = async () => {
  
    setGenerateLoading(true);

    try {
      const res = await openai.createCompletion({
        model: "text-davinci-003", 
        prompt: `I Have Defined Place Like Stadium, Auditorium And Art Gallery in Metaverse. SO If ${prompt} In Which Place From Above I Should Do That?` ,
        max_tokens: 2048,
      });
     setAnswer(res.data.choices[0].text);

      setGenerateLoading(false);
    } catch (error) {
      console.error(`Error generating image: ${error}`);
      setGenerateLoading(false);
    }
  };

  return (
    <div>
      <Meta title="Create" />
      {/* <!-- Create --> */}
      <section className="relative py-24">
        <picture className="pointer-events-none absolute inset-0 -z-10 dark:hidden">
          <img
            src="/images/gradient_light.jpg"
            alt="gradient"
            className="h-full w-full"
          />
        </picture>
        <div className="container">
          <h1 className="font-display text-jacarta-700 py-16 text-center text-4xl font-medium dark:text-white">
            Create NFT
          </h1>

          <div className="flex flex-wrap">
            <div className="mx-auto max-w-[48.125rem]">
              {/* <!-- File Upload --> */}
              <div className="mb-6">
                <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                  JPG, PNG, GIF, SVG
                  <span className="text-red">*</span>
                </label>

                {file ? (
                  <p className="dark:text-jacarta-300 text-2xs mb-3">
                    {loading
                      ? "File Uploading...!"
                      : `successfully uploaded : ${file}`}
                  </p>
                ) : (
                  <p className="dark:text-jacarta-300 text-2xs mb-3">
                    Drag or choose your file to upload
                  </p>
                )}

                <div className="dark:bg-jacarta-700 dark:border-jacarta-600 border-jacarta-100 group relative flex max-w-3xl flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-20 px-5 text-center">
                  <div className="relative z-10 cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      className="fill-jacarta-500 mb-4 inline-block dark:fill-white"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M16 13l6.964 4.062-2.973.85 2.125 3.681-1.732 1-2.125-3.68-2.223 2.15L16 13zm-2-7h2v2h5a1 1 0 0 1 1 1v4h-2v-3H10v10h4v2H9a1 1 0 0 1-1-1v-5H6v-2h2V9a1 1 0 0 1 1-1h5V6zM4 14v2H2v-2h2zm0-4v2H2v-2h2zm0-4v2H2V6h2zm0-4v2H2V2h2zm4 0v2H6V2h2zm4 0v2h-2V2h2zm4 0v2h-2V2h2z" />
                    </svg>
                    <p className="dark:text-jacarta-300 mx-auto max-w-xs text-xs">
                      JPG, PNG, GIF, SVG. Max size: 20 MB
                    </p>
                  </div>
                  <div className="dark:bg-jacarta-600 bg-jacarta-50 absolute inset-4 cursor-pointer rounded opacity-0 group-hover:opacity-100 ">
                    <FileUploader
                      handleChange={handleChange}
                      name="file"
                      types={fileTypes}
                      classes="file-drag"
                      maxSize={100}
                      minSize={0}
                    />
                  </div>
                </div>
              </div>

              {/* <!-- Name --> */}
              <div className="mb-6">
                <label
                  htmlFor="item-name"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Name<span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  id="item-name"
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  placeholder="Item name"
                  required
                  onChange={(e) => setNftName(e.target.value)}
                />
              </div>

              <div>
                {/* dropdown */}
                <div className="dropdown relative my-1 cursor-pointer mb-6">
                  <label
                    htmlFor="item-name"
                    className="font-display text-jacarta-700 mb-2 block dark:text-white"
                  >
                    Metaverse Places<span className="text-red">*</span>
                  </label>
                  <Tippy
                    animation="fade"
                    arrow={false}
                    trigger="click"
                    interactive="true"
                    placement="bottom"
                    className="tooltip-container"
                    content={
                      <div
                        className="dropdown-menu dark:bg-jacarta-800 z-10 hidden min-w-[220px] whitespace-nowrap rounded-xl bg-white py-4 px-2 text-left shadow-xl show text-jacarta-500"
                        aria-labelledby="categoriesSort"
                      >
                        {data.map((item) => {
                          const { id, text } = item;
                          return (
                            <button
                              key={id}
                              className="dropdown-item font-display text-jacarta-700 dark:hover:bg-jacarta-600 hover:bg-jacarta-50 flex w-full items-center justify-between rounded-xl px-5 py-2 text-left text-sm transition-colors dark:text-white"
                              onClick={(e) => {
                                setsortActive(id);

                                setSortFilterText(text);
                                handleInput(e, text);
                              }}
                            >
                              {text}
                              {sortActive === id && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  width="24"
                                  height="24"
                                  className="fill-accent mb-[3px] h-4 w-4"
                                >
                                  <path fill="none" d="M0 0h24v24H0z" />
                                  <path d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    }
                  >
                    <div className="dark:bg-jacarta-700 dropdown-toggle border-jacarta-100 dark:border-jacarta-600 inline-flex w-48 items-center justify-between rounded-lg border bg-white py-2 px-3 text-sm dark:text-white dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white">
                      <span className="font-display">
                        {place == "" ? "Places" : place}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        className="fill-jacarta-500 h-4 w-4 dark:fill-white"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z"></path>
                      </svg>
                    </div>
                  </Tippy>
                  <label
                    className="font-display text-jacarta-700 mb-2 block dark:text-white"
                    style={{ fontSize: "13px", cursor: "pointer" }}
                    onClick={() => handleClickOpen()}
                  >
                    Not sure, which place to select for your ad? Ask
                    expert(Click Here)<span className="text-red">*</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <div className="mb-6 mr-2">
                    <label
                      htmlFor="item-name"
                      className="font-display text-jacarta-700 mb-2 block dark:text-white"
                    >
                      Start Time<span className="text-red">*</span>
                    </label>
                    <DatePicker
                      id="start-date"
                      label="Start Date"
                      value={startDate}
                      onChange={handleStartDateChange}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="item-name"
                      className="font-display text-jacarta-700 mb-2 block dark:text-white"
                    >
                      End Time<span className="text-red">*</span>
                    </label>
                    <DatePicker
                      id="end-date"
                      label="End Date"
                      value={endDate}
                      onChange={handleEndDateChange}
                    />
                  </div>
                </LocalizationProvider>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="item-price"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Price<span className="text-red">*</span>
                </label>
                <input
                  type="number"
                  onChange={(e) => setpPrice(e.target.value)}
                  id="item-price"
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  placeholder="Item Price"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="item-description"
                  className="font-display text-jacarta-700 mb-2 block dark:text-white"
                >
                  Description
                </label>
                <textarea
                  id="item-description"
                  className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white"
                  rows="4"
                  required
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a detailed description of your item."
                ></textarea>
              </div>
              <button
                onClick={handleCreateNFT}
                disabled={loadingcreate}
                className="bg-accent-lighter hover:bg-accent-dark cursor-pointer rounded-full py-3 px-8 text-center font-semibold text-white transition-all"
              >
                {loadingcreate ? "Creating...." : "Create"}
              </button>
            </div>
            <div className="mt-6 mx-auto">
              <label className="font-display text-jacarta-700 mb-2 block dark:text-white">
                Preview NFT
              </label>
              <div className="dark:bg-jacarta-700 dark:border-jacarta-700 border-jacarta-100 rounded-2xl block border bg-white p-[1.1875rem] transition-shadow hover:shadow-lg text-jacarta-500">
                <img
                  src={file ? file : "/images/products/item_1.jpg"}
                  alt={nftname}
                  className="rounded-[0.625rem] w-full h-[240px]"
                  loading="lazy"
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white line-clamp-2 min-w-[100px] max-w-[200px] w-[180px]">
                    {nftname ? nftname : "NFT name"}
                  </span>
                  <span className="dark:border-jacarta-600 border-jacarta-100 flex items-center whitespace-nowrap rounded-md border py-1 px-2">
                    <Tippy content={<span>FLOW</span>}>
                      <img
                        src="/images/chains/fl.png"
                        alt=""
                        className="w-3 h-3 mr-1"
                      />
                    </Tippy>

                    <span className="text-green text-sm font-medium tracking-tight">
                      {price} FLOW
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap justify-between mt-5">
                  <div className="flex flex-col mr-2">
                    <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                      Start Date
                    </span>
                    <span className="dark:text-jacarta-300 text-jacarta-500">
                      {dayjs(startDate).format("LL")}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-display text-jacarta-700 hover:text-accent text-base dark:text-white">
                      End Date
                    </span>
                    <span className="dark:text-jacarta-300 text-jacarta-500">
                      {dayjs(endDate).format("LL")}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm">
                  <span className="dark:text-jacarta-300 text-jacarta-500 line-clamp-3 min-w-[200px] max-w-[300px] w-[240px]">
                    {description ? description : "Description"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#8358ff" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              FlowAI 👋
            </IconButton>
            <Typography
              sx={{ ml: 2, flex: 1 }}
              variant="h6"
              component="div"
            ></Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth={false}>
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div className="mb-6">
              <label
                htmlFor="description"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                provide us a brief description of what you want.
                <span className="text-red">*</span>
              </label>
              <textarea
                placeholder={"I Want To Do Advertisment Of...."}
                id="question"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="dark:bg-jacarta-700 border-jacarta-100 hover:ring-accent/10 focus:ring-accent dark:border-jacarta-600 dark:placeholder:text-jacarta-300 w-full rounded-lg py-3 px-3 hover:ring-2 dark:text-white font-display text-jacarta-700 mb-2 block dark:text-white"
                rows="6"
                required
              ></textarea>

              <button className="bg-accent-lighter hover:bg-accent-dark cursor-pointer rounded-full py-3 px-8 text-center font-semibold text-white transition-all" onClick={() => generateContent()}>
               {generateLoading ? "Generating..." : "Generate"}
              </button>

              <label
                htmlFor="description"
                className="font-display text-jacarta-700 mb-2 block dark:text-white"
              >
                   {answer}
              </label>
            </div>
          </Box>
        </Container>
      </Dialog>
    </div>
  );
};

export default Create;
