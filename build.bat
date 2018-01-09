echo "Build & Install cloud-common jar!"
cd ../web-common
call mvn install
cd ../web-dface-community
echo "Build & Install cloud-common jar is done!"
echo "Build dynamicFace war!"
call mvn clean package
echo "Build dynamicFace war done"