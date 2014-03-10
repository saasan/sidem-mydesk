@ECHO OFF
%~d0
PUSHD %~dp0

robocopy js ..\githubPages\source\sidem-mydesk\js * /MIR /XA:SH

POPD
PAUSE
